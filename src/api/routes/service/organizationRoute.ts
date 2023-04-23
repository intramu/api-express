import express from "express";
import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { Organization } from "../../../models/Organization";
import { organizationIdParam } from "../../../utilities/validation/validationSchemas";
import { Admin } from "../../../models/Admin";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import {
    newOrganizationSchema,
    newOrganizationSchemaWithAuth0,
    updateOrganizationSchema,
} from "../../../utilities/validation/organizationValidation";
import { IOrganization, IOrganizationWithAdmin } from "../../../interfaces/IOrganization";

const router = express.Router();

const organizationService = new OrganizationBusinessService();

router
    .route("/organizations")
    // TODO: paging
    .get(async (req, res) => {
        const response = await organizationService.findAllOrganizations();

        return handleErrorResponse(response, res);
    })
    .post(newOrganizationSchema, async (req, res) => {
        const {
            admin: { authId, firstName, lastName, language, emailAddress },
            organization: { name, info, mainColor },
        } = req.body as IOrganizationWithAdmin;

        const organization = new Organization({ name, info, mainColor });
        const admin = new Admin({ authId, firstName, lastName, language, emailAddress });

        const response = await organizationService.createOrganization(organization, admin);

        return handleErrorResponse(response, res, 201);
    });
// todo: business service needs patch method
router.post("/organizations/auth0", newOrganizationSchemaWithAuth0, async (req, res) => {
    const {
        admin: { firstName, lastName, language, emailAddress },
        organization: { name, info, mainColor },
    } = req.body as IOrganizationWithAdmin;

    const organization = new Organization({ name, info, mainColor });
    const admin = new Admin({ firstName, lastName, language, emailAddress });

    const response = await organizationService.createOrganizationWithAuth0Account(
        organization,
        admin
    );

    return handleErrorResponse(response, res, 201);
});

router
    .route("/organizations/:orgId")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await organizationService.findOrganizationById(orgId);

        return handleErrorResponse(response, res);
    })
    .patch(updateOrganizationSchema, async (req, res) => {
        const { orgId } = req.params;
        const b = req.body as IOrganization;

        const organization = new Organization({ ...b, id: orgId });
        const response = await organizationService.updateOrganization(organization);

        return handleErrorResponse(response, res);
    });

export default router;
