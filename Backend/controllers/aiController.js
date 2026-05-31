import { GoogleGenerativeAI } from "@google/generative-ai"; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateEmail = async (req, res) => {
  try {
    const { emailType, emailTone, keyPoints } = req.body;

    if (!emailType || !emailTone || !keyPoints) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    you are a freelancer assitant generative Ai and your name would be LancerFlow AI so now,
    Write a ${emailTone} ${emailType} email.
    Tone: ${emailTone}
    Type: ${emailType}
    Key Points: ${keyPoints}
    
    Make the email clear, well-structured, and ready to send.
    Include a professional subject line also.
    ignore extra lines just give only email don't put some other stuffs too.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); 

    return res.status(200).json({
      email: text, 
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating email",
    });
  }
};

export const generateProposal = async (req, res) => {
  try {
    const { clientName, clientRequirements, budget, timeline } = req.body;

    if (!clientName || !clientRequirements || !budget || !timeline) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a professional freelance assistant AI named LancerFlow AI.

    Generate a client proposal based on the following details:

    Client Name: ${clientName}
    Client Requirements: ${clientRequirements}
    Budget: ${budget}
    Timeline: ${timeline}

    The proposal should include:
    - Proper greeting
    - Understanding of client requirements
    - Proposed solution
    - Timeline and budget acknowledgement
    - Closing statement

    Keep it professional, clear, and ready to send.
    Do not add any extra explanation outside the proposal.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      proposal: text,
    });

  } catch (error) {
    console.error("Gemini Proposal Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating proposal",
    });
  }
};

export const generateContract = async (req, res) => {
  try {
    const { projectName, scopeOfWork, budget, timeline, deliverables, paymentTerms } = req.body;

    if (!projectName || !scopeOfWork || !budget || !timeline || !deliverables || !paymentTerms) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a professional freelance legal assistant AI named LancerFlow AI.

    Generate a freelance contract based on the following details:

    Project Name: ${projectName}
    Scope of Work: ${scopeOfWork}
    Budget: ${budget}
    Timeline: ${timeline}
    Deliverables: ${deliverables}
    Payment Terms: ${paymentTerms}

    The contract should include:
    - Project overview
    - Scope of work in detail
    - Deliverables
    - Timeline
    - Payment terms
    - Terms & conditions
    - Closing agreement section

    Make it professional, structured, and legally styled but simple to understand.
    Do not add explanations outside the contract.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      contract: text,
    });

  } catch (error) {
    console.error("Gemini Contract Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating contract",
    });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const {
      clientName,
      projectName,
      invoiceNumber,
      services,
      amount,
      dueDate,
      paymentTerms
    } = req.body;

    if (!clientName || !projectName || !invoiceNumber || !services || !amount || !dueDate || !paymentTerms) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a professional freelance billing assistant AI named LancerFlow AI.

    Generate a clean, client-ready invoice using the following details:

    Client Name: ${clientName}
    Project Name: ${projectName}
    Invoice Number: ${invoiceNumber}
    Services: ${services}
    Amount: ${amount}
    Due Date: ${dueDate}
    Payment Terms: ${paymentTerms}

    The invoice should include:
    - Invoice title and invoice number
    - Client and project details
    - Itemized service summary
    - Total amount due
    - Due date
    - Payment terms
    - Short professional closing note

    Keep it structured, concise, and ready to send.
    Do not add explanations outside the invoice.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      invoice: text,
    });

  } catch (error) {
    console.error("Gemini Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating invoice",
    });
  }
};
