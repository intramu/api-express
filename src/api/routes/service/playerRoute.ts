import express from "express";
import { param } from "express-validator";
import { requiredScopes } from "express-oauth2-jwt-bearer";

import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { PlayerNew } from "../../../interfaces/Player";
import { APIResponse } from "../../../models/APIResponse";
import { Organization } from "../../../models/Organization";
import { Player } from "../../../models/Player";
import {
    newOrganizationSchema,
    newPersonSchema,
    validate,
} from "../../../utilities/validationSchemas";
import { PlayerBusinessService } from "../../../business/service/PlayerBusinessService";

const router = express.Router();

const playerService = new PlayerBusinessService();
const organizationService = new OrganizationBusinessService();

router.route("/").get(async (req, res) => {
    const response = await playerService.findAllPlayers();

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

// TODO: add length validation on param
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await playerService.findPlayerById(id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});
