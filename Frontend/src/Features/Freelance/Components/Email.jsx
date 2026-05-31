import React, { useContext, useState } from "react";
import { Mail, WandSparkles } from "lucide-react";
import { generateEmail } from "../Apis/AIapi";
import AiResultPanel from "./AiResultPanel";
import { AuthContext } from "../../Auth/AuthContext";
import { notify } from "../utils/notify";

const getErrorMessage = (response, fallback) =>
  response?.data?.message || fallback || "Something went wrong. Please try again.";

export default function Email() {
  const { user } = useContext(AuthContext);
  const [emailType, setEmailType] = useState("proposal");
  const [emailTone, setEmailTone] = useState("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchEmail = async () => {
    if (!keyPoints.trim()) {
      setError("Add the key points before generating an email.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const res = await generateEmail({ emailType, emailTone, keyPoints });

      if (!res?.data?.email) {
        setError(getErrorMessage(res, "Email generation failed."));
        return;
      }

      setGeneratedEmail(res.data.email);
      notify({
        ownerId: user?._id,
        type: "ai",
        action: "generated",
        title: "Email generated",
        message: `A ${emailTone} ${emailType} email was generated with LancerFlow AI.`
      });
      console.log("Generated Email:", res.data.email);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 py-8 pr-6">
      <div>
        <h1 className="text-3xl">AI Email Generator</h1>
        <p className="text-xl text-white/50">Draft professional, high-impact emails in seconds.</p>
      </div>

      <div className="flex flex-col justify-center gap-8 xl:flex-row">
        <div className="flex h-[560px] w-full max-w-[460px] flex-col gap-5 rounded-4xl border border-white/10 border-t-2 border-t-blue-700 bg-black/30 px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-blue-400/20 bg-blue-500/15 p-3 text-blue-100">
              <Mail size={22} />
            </span>
            <div>
              <p className="text-xl text-white/80">Email Details</p>
              <p className="text-sm text-white/40">Choose type, tone, and context.</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-white/55">Email Type</p>
            <div className="flex rounded-4xl bg-white/10 p-1">
              {["proposal", "update", "reminder"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEmailType(type)}
                  className={`${emailType === type ? "bg-blue-800 text-white" : "text-white/55"} h-10 flex-1 rounded-4xl text-sm capitalize transition`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-white/55">Tone</p>
            <div className="grid grid-cols-3 gap-2">
              {["professional", "friendly", "urgent"].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setEmailTone(tone)}
                  className={`${emailTone === tone ? "border-blue-400/40 bg-blue-500/15 text-blue-100" : "border-white/10 bg-white/5 text-white/55"} h-10 rounded-3xl border text-sm capitalize transition`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <label className="flex min-h-0 flex-1 flex-col gap-3">
            <span className="text-sm text-white/55">Key Points</span>
            <textarea
              className="min-h-0 flex-1 resize-none rounded-4xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              onChange={(e) => setKeyPoints(e.target.value)}
              value={keyPoints}
              placeholder="Mention client name, project context, goal, deadline, or next action..."
            />
          </label>

          <button
            onClick={fetchEmail}
            disabled={isGenerating}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-blue-700 text-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles size={18} />
            {isGenerating ? "Generating Email" : "Generate Email"}
          </button>
        </div>

        <AiResultPanel
          title="Generated Email"
          value={generatedEmail}
          placeholder="Your generated email will appear here."
          isLoading={isGenerating}
          error={error}
        />
      </div>
    </div>
  );
}
