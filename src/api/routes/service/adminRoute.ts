import express from "express";
import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { IAdminNewService } from "../../../interfaces/IAdmin";
import { Admin } from "../../../models/Admin";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { newAdminSchema, patchAdminSchema } from "../../../utilities/validation/adminValidation";
import { authIdParam, organizationIdParam } from "../../../utilities/validation/validationSchemas";

const organizationService = new OrganizationBusinessService();

const router = express.Router();

// FEATURE: pagination and filtering for master admins
router.get("/admins", async (req, res) => {
    const response = await organizationService.findAllAdmins();

    return handleErrorResponse(response, res);
});

router
    .route("/admins/:userId")
    .get(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await organizationService.findAdminbyId(userId);

        return handleErrorResponse(response, res);
    })
    .delete(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await organizationService.removeAdminById(userId);

        return handleErrorResponse(response, res, 204);
    })
    .patch(authIdParam, patchAdminSchema, async (req, res) => {
        const { userId } = req.params;
        // create admin and add id to it

        const response = true;
        return handleErrorResponse(response, res);
    });

router
    .route("/organizations/:orgId/admins")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await organizationService.findAllAdminsByOrganizationId(orgId);

        return handleErrorResponse(response, res);
    })
    // TODO: get admin working with request body
    .post(organizationIdParam, newAdminSchema, async (req, res) => {
        const { orgId } = req.params;
        const admin = new Admin(req.body as IAdminNewService);

        const response = await organizationService.createAdminByOrganizationId(admin, orgId);

        return handleErrorResponse(response, res, 201);
    });

router.post(
    "/organizations/:orgId/admins/auth0",
    organizationIdParam,
    newAdminSchema,
    async (req, res) => {
        const { orgId } = req.params;
        const b = req.body as Admin;
        console.log(b);

        // const response = await organizationService.createAdminByOrganizationId(b, orgId);
        const response = true;

        return handleErrorResponse(response, res, 201);
    }
);

export default router;
