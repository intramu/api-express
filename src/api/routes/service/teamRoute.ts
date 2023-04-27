import express from "express";
import { TeamBusinessService } from "../../../business/service/TeamBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import {
    authIdBody,
    authIdParam,
    organizationIdParam,
    teamIdParam,
    teamRoleBody,
} from "../../../utilities/validation/common";
import { newJoinRequestSchema } from "../../../utilities/validation/teamValidation";
import { Team } from "../../../models/Team";

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
    .route("/teams/:teamId/players")
    .post(teamIdParam, teamRoleBody, authIdBody, async (req, res) => {
        const { teamId } = req.params;
        const { role, authId } = req.body ?? {};

        const response = await teamService.addPlayerToTeamRoster(Number(teamId), authId, role);
        return handleErrorResponse(response, res, 201);
    });
router
    .route("/teams/:teamId/players/:userId")
    .delete(teamIdParam, authIdParam, async (req, res) => {
        const { teamId, userId } = req.params;
        const response = await teamService.removePlayerFromTeamRoster(Number(teamId), userId);

        return handleErrorResponse(response, res, 204);
    })
    .put(teamIdParam, authIdParam, teamRoleBody, async (req, res) => {
        const { teamId, userId } = req.params;
        const { role } = req.body;

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
        const team = new Team({ ...req.body });
        // get body and create team

        return handleErrorResponse(APIResponse.NotImplemented(), res);
    });

router
    .route("/teams/:teamId/requests/")
    .post(teamIdParam, newJoinRequestSchema, async (req, res) => {
        const { teamId } = req.params;
        const { expirationDate, authId } = req.body;
        const response = await teamService.createTeamJoinRequest(
            Number(teamId),
            authId,
            expirationDate
        );

        return handleErrorResponse(response, res, 201);
    });

export default router;
