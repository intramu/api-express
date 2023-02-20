import express from "express";
import { body } from "express-validator";
import { TeamBusinessService } from "../../../business/service/TeamBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { TeamRole } from "../../../utilities/enums/teamEnum";
import { teamRoleBody } from "../../../utilities/validation/common";
import {
    authIdParam,
    organizationIdParam,
    teamIdParam,
    validate,
} from "../../../utilities/validation/validationSchemas";

const teamService = new TeamBusinessService();

const router = express.Router();

router.get("/teams", async (req, res) => {
    const response = await teamService.findAllTeams();

    return handleErrorResponse(response, res);
});

router
    .route("/teams/:teamId")
    .get(teamIdParam, async (req, res) => {
        const { teamId } = req.params;

        const response = await teamService.findTeamById(Number(teamId));

        return handleErrorResponse(response, res);
    })
    .delete(teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const response = await teamService.removeTeamById(Number(teamId));

        return handleErrorResponse(response, res, 204);
    });

router
    .route("/teams/:teamId/players/:userId")
    .delete(teamIdParam, authIdParam, async (req, res) => {
        const { teamId, userId } = req.params;
        const response = await teamService.removePlayerFromTeamRoster(Number(teamId), userId);
        // const response = true;

        return handleErrorResponse(response, res, 204);
    })
    .post(
        teamIdParam,
        authIdParam,
        validate([
            body("role")
                .optional()
                .trim()
                .toUpperCase()
                .isIn([TeamRole.COCAPTAIN, TeamRole.PLAYER])
                .withMessage("valid role options are [ COCAPTAIN, PLAYER ] "),
        ]),
        async (req, res) => {
            const { teamId, userId } = req.params;
            const { role } = req.body ?? {};

            const response = await teamService.addPlayerToTeamRoster(Number(teamId), userId, role);
            return handleErrorResponse(response, res, 201);
        }
    )
    .put(teamIdParam, authIdParam, teamRoleBody, async (req, res) => {
        const { teamId, userId } = req.params;
        const { role } = req.body ?? {};

        const response = await teamService.updatePlayerOnTeamRoster(Number(teamId), userId, role);

        return handleErrorResponse(response, res);
    });

router
    .route("/organizations/:orgId/teams")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await teamService.findAllTeamsByOrganizationId(orgId);

        return handleErrorResponse(response, res);
    })
    .post(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        // get body and create team

        return handleErrorResponse(APIResponse[501](), res);
    });

export default router;
