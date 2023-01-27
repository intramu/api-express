import express from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { OrganizationBusinessService } from "../../business/OrganizationBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { newOrganizationRules, validate } from "../../utilities/validationSchemas";

const router = express.Router();

const organizationService = new OrganizationBusinessService();

router.post(
    "/",
    validate(newOrganizationRules()),
    async (req: express.Request, res: express.Response) => {
        return res.status(200).json("Created");
    }
);

export default router;
