import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6969/api/ai"
})

export async function generateEmail({emailType,emailTone,keyPoints}){
    try {
        const response = await api.post("/email",{emailType,emailTone,keyPoints});
        return response
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export async function generateProposal ({clientName,clientRequirements,budget,timeline}){
    try {
        const response = await api.post("/proposal",{clientName,clientRequirements,budget,timeline});
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export async function generateContract({projectName,scopeOfWork,budget,timeline,deliverables,paymentTerms}){
    try {
        const response = await api.post("/contract",{
            projectName,
            scopeOfWork,
            budget,
            timeline,
            deliverables,
            paymentTerms
        });
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export async function generateInvoice({
    clientName,
    projectName,
    invoiceNumber,
    services,
    amount,
    dueDate,
    paymentTerms
}){
    try {
        const response = await api.post("/invoice",{
            clientName,
            projectName,
            invoiceNumber,
            services,
            amount,
            dueDate,
            paymentTerms
        });
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}
