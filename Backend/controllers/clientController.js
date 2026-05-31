import client from "../models/clientModel.js";
import httpStatus from "http-status";

export async function addClient(req,res) {
    let {
        clientName,
        clientCompany,
        clientPhone,
        clientEmail,
        clientStatus,
        clientOwner
    } = req.body

    try {
        if(!clientName){
            return res.status(httpStatus.BAD_REQUEST).json({message:"Please Enter Client Name"})
        }
        const newClient = new client({
            clientName,
            clientCompany,
            clientPhone,
            clientEmail,
            clientStatus,
            clientOwner
        })
        await newClient.save();
        return res.status(httpStatus.CREATED).json({message:"New Client Created", data: newClient})
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}


export async function getClients(req, res) {
    try {
        const { ownerid } = req.params;

        if (!ownerid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Owner ID is required"
            });
        }

        const clients = await client.find({ clientOwner: ownerid }).sort({ clientName: 1 });

        return res.status(httpStatus.OK).json({
            message: "Clients fetched successfully",
            data: clients
        });

    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

export async function updateClient(req, res) {
    try {
        const { clientid } = req.params;

        if (!clientid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Client ID is required"
            });
        }

        const updatedClient = await client.findByIdAndUpdate(
            clientid,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Client not found"
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Client updated successfully",
            data: updatedClient
        });

    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

export async function deleteClient(req, res) {
    try {
        const { clientid } = req.params;

        if (!clientid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Client ID is required"
            });
        }

        const deletedClient = await client.findByIdAndDelete(clientid);

        if (!deletedClient) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Client not found"
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Client deleted successfully",
            data: deletedClient
        });

    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}
