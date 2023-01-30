import express from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { OrganizationBusinessService } from "../../business/OrganizationBusinessService";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { newOrganizationRules, validate } from "../../utilities/validationSchemas";

const router = express.Router();

const organizationService = new OrganizationBusinessService();
const playerService = new PlayerBusinessService();

router.post(
    "/",
    validate(newOrganizationRules()),
    async (req: express.Request, res: express.Response) => {
        return res.status(200).json("Created");
    }
);

router.get(
    "/",
    // checkJwt,
    async (req, res) => {
        const response = await playerService.findOrganizationList();

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }
        return res.status(200).json(response);
    }
);

export default router;
