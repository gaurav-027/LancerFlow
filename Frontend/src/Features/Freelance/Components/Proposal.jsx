import React, { useContext, useState } from "react";
import { Handshake, WandSparkles } from "lucide-react";
import { generateProposal } from "../Apis/AIapi";
import AiResultPanel from "./AiResultPanel";
import { AuthContext } from "../../Auth/AuthContext";
import { notify } from "../utils/notify";

const getErrorMessage = (response, fallback) =>
  response?.data?.message || fallback || "Something went wrong. Please try again.";

export default function Proposal() {
  const { user } = useContext(AuthContext);
  const [clientName, setClientName] = useState("");
  const [clientRequirements, setClientRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchProposal = async () => {
    if (!clientName.trim() || !clientRequirements.trim() || !budget.trim() || !timeline.trim()) {
      setError("Fill every proposal field before generating.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const res = await generateProposal({
        clientName,
        clientRequirements,
        budget,
        timeline
      });

      if (!res?.data?.proposal) {
        setError(getErrorMessage(res, "Proposal generation failed."));
        return;
      }

      setGeneratedProposal(res.data.proposal);
      notify({
        ownerId: user?._id,
        type: "ai",
        action: "generated",
        title: "Proposal generated",
        message: `A proposal for ${clientName} was generated with LancerFlow AI.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 py-8 pr-6">
      <div>
        <h1 className="text-3xl">AI Proposal Generator</h1>
        <p className="text-xl text-white/50">Turn client requirements into a ready-to-send proposal.</p>
      </div>

      <div className="flex flex-col justify-center gap-8 xl:flex-row">
        <div className="flex h-[560px] w-full max-w-[520px] flex-col gap-5 rounded-4xl border border-white/10 border-t-2 border-t-blue-700 bg-black/30 px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-blue-400/20 bg-blue-500/15 p-3 text-blue-100">
              <Handshake size={22} />
            </span>
            <div>
              <p className="text-xl text-white/80">Proposal Details</p>
              <p className="text-sm text-white/40">Scope, budget, and delivery plan.</p>
            </div>
          </div>

          <input
            type="text"
            onChange={(e) => setClientName(e.target.value)}
            value={clientName}
            className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Client Name"
          />

          <textarea
            className="min-h-[150px] flex-1 resize-none rounded-4xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Client Requirements"
            onChange={(e) => setClientRequirements(e.target.value)}
            value={clientRequirements}
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
              placeholder="Timeline, e.g. 2 weeks"
            />
          </div>

          <button
            onClick={fetchProposal}
            disabled={isGenerating}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-blue-700 text-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles size={18} />
            {isGenerating ? "Generating Proposal" : "Generate Proposal"}
          </button>
        </div>

        <AiResultPanel
          title="Generated Proposal"
          value={generatedProposal}
          placeholder="Your generated proposal will appear here."
          isLoading={isGenerating}
          error={error}
          downloadable
          fileName={`proposal-${clientName || "client"}`}
        />
      </div>
    </div>
  );
}
