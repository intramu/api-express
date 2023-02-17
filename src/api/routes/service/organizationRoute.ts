import express from "express";
import { param } from "express-validator";
import { requiredScopes } from "express-oauth2-jwt-bearer";

import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Organization } from "../../../models/Organization";
import { Player } from "../../../models/Player";
import {
    newContestSchema,
    newOrganizationSchema,
    newPersonSchema,
    organizationIdParam,
    validate,
} from "../../../utilities/validationSchemas";
import { Admin } from "../../../models/Admin";
import { isErrorResponse } from "../../../utilities/apiFunctions";

const router = express.Router();

const organizationService = new OrganizationBusinessService();
// const playerService = new PlayerBusinessService();

router
    .route("/")
    // TODO: paging
    .get(async (req, res) => {
        const response = await organizationService.findAllOrganizations();

        return isErrorResponse(response, res);
    })
    // TODO: new endpoint for creating organizations with and without auth0 account
    // REVISIT
    .post(validate(newOrganizationSchema()), async (req, res) => {
        const {
            admin: { firstName, lastName, language, emailAddress },
            organization: { name, info, mainColor },
        } = req.body;

        const organization = new Organization({
            id: "",
            name,
            image: "",
            info,
            mainColor,
            approvalStatus: null,
            dateCreated: null,
        });

        const admin = {
            firstName,
            lastName,
            language,
            emailAddress,
        };

        const response = await organizationService.createOrganizationWithAuth0Account(
            organization,
            admin
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).send(response);
        }

        return res.status(201).json(response);
    })
    // todo: validation schema
    // todo: business service needs patch method
    .patch(async (req, res) => {
        // const response = await organizationService.
        return res.status(501).json(APIResponse[501]());
    });

router
    .route("/organization/:orgId")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await organizationService.findOrganizationById(orgId);

        return isErrorResponse(response, res);
    })
    .patch(async (req, res) => {
        const { orgId } = req.params;
        // get organization from body and assign it id

        return APIResponse[501]();
    });

export default router;
