import {Router} from "express";
import { generateEmail, generateProposal, generateContract, generateInvoice } from "../controllers/aiController.js";

const apiRoute = Router();

apiRoute.route('/email').post(generateEmail)
apiRoute.route('/proposal').post(generateProposal)
apiRoute.route('/contract').post(generateContract)
apiRoute.route('/invoice').post(generateInvoice)

export default apiRoute;
