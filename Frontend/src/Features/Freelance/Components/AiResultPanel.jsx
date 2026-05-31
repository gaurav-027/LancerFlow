import React, { useState } from "react";
import { Download } from "lucide-react";
import { CopyIcon } from "../../../components/ui/copy";
import { downloadTextAsPdf } from "../utils/pdf";
import { ScaleLoader } from "react-spinners";

export default function AiResultPanel({
  title,
  value,
  placeholder,
  isLoading,
  error,
  downloadable = false,
  fileName = "lancerflow-document"
}) {
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex h-[560px] w-full max-w-[760px] flex-col overflow-hidden rounded-4xl border border-white/10 border-t-2 border-t-blue-700 bg-black/30 px-6 py-5">
      <div className="flex h-9 items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-600" />
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <div className="h-3 w-3 rounded-full bg-green-600" />
          <p className="ml-3 text-sm text-white/50">{title}</p>
        </div>

        <div className="flex items-center gap-2">
          {downloadable ? (
            <button
              onClick={() => downloadTextAsPdf({ title, content: value, fileName })}
              disabled={!value}
              className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={17} />
              PDF
            </button>
          ) : null}

          <button
            onClick={copyResult}
            disabled={!value}
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white/55 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CopyIcon size={20} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-3xl bg-white/[0.03] p-5 text-sm leading-7 text-white/85">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-white/50">
            <ScaleLoader color="#3b82f6" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">
            {error}
          </div>
        ) : value ? (
          <p className="whitespace-pre-line">{value}</p>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-white/35">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
