import React, { useContext, useState } from "react";
import { FileStack, WandSparkles } from "lucide-react";
import { generateContract } from "../Apis/AIapi";
import AiResultPanel from "./AiResultPanel";
import { AuthContext } from "../../Auth/AuthContext";
import { notify } from "../utils/notify";

const getErrorMessage = (response, fallback) =>
  response?.data?.message || fallback || "Something went wrong. Please try again.";

export default function Contract() {
  const { user } = useContext(AuthContext);
  const [projectName, setProjectName] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [generatedContract, setGeneratedContract] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchContract = async () => {
    if (
      !projectName.trim() ||
      !scopeOfWork.trim() ||
      !budget.trim() ||
      !timeline.trim() ||
      !deliverables.trim() ||
      !paymentTerms.trim()
    ) {
      setError("Fill every contract field before generating.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const res = await generateContract({
        projectName,
        scopeOfWork,
        budget,
        timeline,
        deliverables,
        paymentTerms
      });

      if (!res?.data?.contract) {
        setError(getErrorMessage(res, "Contract generation failed."));
        return;
      }

      setGeneratedContract(res.data.contract);
      notify({
        ownerId: user?._id,
        type: "ai",
        action: "generated",
        title: "Contract generated",
        message: `A contract for ${projectName} was generated with LancerFlow AI.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 py-8 pr-6">
      <div>
        <h1 className="text-3xl">AI Contract Generator</h1>
        <p className="text-xl text-white/50">Create a clear freelance contract from your project terms.</p>
      </div>

      <div className="flex flex-col justify-center gap-8 xl:flex-row">
        <div className="flex h-[620px] w-full max-w-[560px] flex-col gap-4 rounded-4xl border border-white/10 border-t-2 border-t-blue-700 bg-black/30 px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-blue-400/20 bg-blue-500/15 p-3 text-blue-100">
              <FileStack size={22} />
            </span>
            <div>
              <p className="text-xl text-white/80">Contract Details</p>
              <p className="text-sm text-white/40">Scope, deliverables, and payment terms.</p>
            </div>
          </div>

          <input
            type="text"
            onChange={(e) => setProjectName(e.target.value)}
            value={projectName}
            className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Project Name"
          />

          <textarea
            className="min-h-[110px] resize-none rounded-4xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Scope of Work"
            onChange={(e) => setScopeOfWork(e.target.value)}
            value={scopeOfWork}
          />

          <textarea
            className="min-h-[95px] resize-none rounded-4xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Deliverables"
            onChange={(e) => setDeliverables(e.target.value)}
            value={deliverables}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              onChange={(e) => setBudget(e.target.value)}
              value={budget}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Budget"
            />
            <input
              type="text"
              onChange={(e) => setTimeline(e.target.value)}
              value={timeline}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Timeline"
            />
          </div>

          <input
            type="text"
            onChange={(e) => setPaymentTerms(e.target.value)}
            value={paymentTerms}
            className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Payment Terms, e.g. 50% upfront, 50% on delivery"
          />

          <button
            onClick={fetchContract}
            disabled={isGenerating}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-blue-700 text-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles size={18} />
            {isGenerating ? "Generating Contract" : "Generate Contract"}
          </button>
        </div>

        <AiResultPanel
          title="Generated Contract"
          value={generatedContract}
          placeholder="Your generated contract will appear here."
          isLoading={isGenerating}
          error={error}
          downloadable
          fileName={`contract-${projectName || "project"}`}
        />
      </div>
    </div>
  );
}
