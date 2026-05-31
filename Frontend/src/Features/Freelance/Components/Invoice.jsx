import React, { useContext, useMemo, useState } from "react";
import { ReceiptText, WandSparkles } from "lucide-react";
import { generateInvoice } from "../Apis/AIapi";
import AiResultPanel from "./AiResultPanel";
import { AuthContext } from "../../Auth/AuthContext";
import { notify } from "../utils/notify";

const getErrorMessage = (response, fallback) =>
  response?.data?.message || fallback || "Something went wrong. Please try again.";

export default function Invoice() {
  const { user } = useContext(AuthContext);
  const defaultInvoiceNumber = useMemo(() => `LF-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`, []);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoiceNumber);
  const [services, setServices] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Payment due by the invoice due date.");
  const [generatedInvoice, setGeneratedInvoice] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchInvoice = async () => {
    if (
      !clientName.trim() ||
      !projectName.trim() ||
      !invoiceNumber.trim() ||
      !services.trim() ||
      !amount.trim() ||
      !dueDate.trim() ||
      !paymentTerms.trim()
    ) {
      setError("Fill every invoice field before generating.");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const res = await generateInvoice({
        clientName,
        projectName,
        invoiceNumber,
        services,
        amount,
        dueDate,
        paymentTerms
      });

      if (!res?.data?.invoice) {
        setError(getErrorMessage(res, "Invoice generation failed."));
        return;
      }

      setGeneratedInvoice(res.data.invoice);
      notify({
        ownerId: user?._id,
        type: "ai",
        action: "generated",
        title: "Invoice generated",
        message: `Invoice ${invoiceNumber} for ${clientName} was generated with LancerFlow AI.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 py-8 pr-6">
      <div>
        <h1 className="text-3xl">AI Invoice Generator</h1>
        <p className="text-xl text-white/50">Generate a polished invoice from service and payment details.</p>
      </div>

      <div className="flex flex-col justify-center gap-8 xl:flex-row">
        <div className="flex h-[620px] w-full max-w-[560px] flex-col gap-4 rounded-4xl border border-white/10 border-t-2 border-t-blue-700 bg-black/30 px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-blue-400/20 bg-blue-500/15 p-3 text-blue-100">
              <ReceiptText size={22} />
            </span>
            <div>
              <p className="text-xl text-white/80">Invoice Details</p>
              <p className="text-sm text-white/40">Client, services, amount, and due date.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              onChange={(e) => setClientName(e.target.value)}
              value={clientName}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Client Name"
            />
            <input
              type="text"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Project Name"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              onChange={(e) => setInvoiceNumber(e.target.value)}
              value={invoiceNumber}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Invoice Number"
            />
            <input
              type="date"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            />
          </div>

          <textarea
            className="min-h-[130px] flex-1 resize-none rounded-4xl border border-white/10 bg-white/5 p-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
            placeholder="Services, e.g. UI design, frontend development, revisions..."
            onChange={(e) => setServices(e.target.value)}
            value={services}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Amount"
            />
            <input
              type="text"
              onChange={(e) => setPaymentTerms(e.target.value)}
              value={paymentTerms}
              className="h-12 rounded-4xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/30 focus:border-blue-400/40"
              placeholder="Payment Terms"
            />
          </div>

          <button
            onClick={fetchInvoice}
            disabled={isGenerating}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-3xl bg-blue-700 text-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles size={18} />
            {isGenerating ? "Generating Invoice" : "Generate Invoice"}
          </button>
        </div>

        <AiResultPanel
          title="Generated Invoice"
          value={generatedInvoice}
          placeholder="Your generated invoice will appear here."
          isLoading={isGenerating}
          error={error}
          downloadable
          fileName={`invoice-${invoiceNumber || "lancerflow"}`}
        />
      </div>
    </div>
  );
}
