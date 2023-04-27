import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { OrganizationBusinessService } from "../../../business/user/OrganizationBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { checkJwt } from "../../../utilities/authUtilities";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { Admin } from "../../../models/Admin";
import { authIdParam } from "../../../utilities/validation/common";
import { teamIdParam } from "../../../utilities/validation/common";
import { Team } from "../../../models/Team";

const router = express.Router();

const organizationService = new OrganizationBusinessService();

const adminScoped = requiredScopes("all:organization all:application");

router.use(checkJwt);
router.use(adminScoped);

/** Player funcs */
// TODO: Add paging
router.get("/players", async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const response = await organizationService.findAllPlayers(sub);

    return handleErrorResponse(response, res);
});

router.patch("/players/:userId", authIdParam, async (req, res) => {});

/** Admin Funcs */
router
    .route("/admins")
    .get(async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};
        const response = await organizationService.findAllAdmins(sub);

        return handleErrorResponse(response, res);
    })
    .post(async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};
        const admin = new Admin(req.body);

        const response = await organizationService.createAdmin(admin, sub);
        return handleErrorResponse(response, res);
    });

router.patch("/admins/:userId", authIdParam, async (req, res) => {});

/** Team Funcs */
router.get("/teams", async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const response = await organizationService.findAllTeams(sub);

    return handleErrorResponse(response, res);
});

router.patch("/teams/:teamId", teamIdParam, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const team = new Team(req.body);

    // const response = await teamService.patchTeam(sub, team);
    // return handleErrorResponse(response, res);
    return res.status(501).json(APIResponse.NotImplemented());
});

/** Organization Funcs */
router
    .route("/")
    .get(async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await organizationService.findOrganizationByAdminId(sub);
        return handleErrorResponse(response, res);
    })
    .patch(async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};

        // const response = await organizationService.patchOrganizationByAdminId(sub)
        return res.status(501).json(APIResponse.NotImplemented());
    });

/** Location Funcs */
router.route("/locations").get(async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};

    const response = await organizationService.findAllLocations(sub);
    return handleErrorResponse(response, res);
});

export default router;
