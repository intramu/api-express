import express from "express";
import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { Admin } from "../../../models/Admin";
import { isErrorResponse } from "../../../utilities/apiFunctions";
import {
    authIdParam,
    newPersonSchema,
    organizationIdParam,
    validate,
} from "../../../utilities/validationSchemas";

const organizationService = new OrganizationBusinessService();

const router = express.Router();

// FEATURE: pagination and filtering for master admins
router.get("/admins", async (req, res) => {
    const response = await organizationService.findAllAdmins();

    return isErrorResponse(response, res);
});

router
    .route("/admins/:userId")
    .get(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await organizationService.findAdminbyId(userId);

        return isErrorResponse(response, res);
    })
    .delete(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await organizationService.removeAdminById(userId);

        return isErrorResponse(response, res, 204);
    })
    // TODO: add admin validation schema for patch
    .patch(authIdParam, async (req, res) => {
        const { userId } = req.params;
        // create admin and add id to it

        const response = true;
        return isErrorResponse(response, res);
    });

router
    .route("/organizations/:orgId/admins")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await organizationService.findAllAdminsByOrganizationId(orgId);

        return isErrorResponse(response, res);
    })
    // TODO: new admin validation schema
    // TODO: get admin working with request body
    .post(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const b = req.body as Admin;

        const response = await organizationService.createAdminByOrganizationId(b, orgId);

        return isErrorResponse(response, res, 201);
    });

export default router;
