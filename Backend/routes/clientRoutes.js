import {Router} from "express";
import { addClient, deleteClient, getClients, updateClient } from "../controllers/clientController.js";

const clientRoute = Router();

clientRoute.route('/create').post(addClient);
clientRoute.route('/show/:ownerid').get(getClients);
clientRoute.route('/update/:clientid').put(updateClient);
clientRoute.route('/delete/:clientid').delete(deleteClient);

export default clientRoute;