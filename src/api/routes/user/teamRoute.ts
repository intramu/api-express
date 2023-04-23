import express from "express";
import { TeamBusinessService } from "../../../business/user/TeamBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Team } from "../../../models/Team";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { authIdParam, teamRoleBody } from "../../../utilities/validation/common";
import { newTeamSchema } from "../../../utilities/validation/teamValidation";
import { teamIdParam } from "../../../utilities/validation/validationSchemas";
import { checkJwt } from "../../../utilities/authUtilities";

const router = express.Router();

const teamService = new TeamBusinessService();

router.use(checkJwt);

router
    .route("/teams/:teamId/requests")
    /** creates request to join team */
    .post(teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.requestToJoinTeam(sub, Number(teamId));
        return handleErrorResponse(response, res, 201);
    })
    /** gets all join requests for team */
    .get(teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.findAllJoinRequests(Number(teamId), sub);
        return handleErrorResponse(response, res);
    });

router.delete("/teams/:teamId/requests/:userId", teamIdParam, authIdParam, async (req, res) => {
    const { sub: authId = "" } = req.auth?.payload ?? {};
    const { userId, teamId } = req.params;

    // from player
    // check teamjoinrequests for playerId and teamId combo.
    // if exists, delete request to join team
    // from captain
    // if doesn't exist, check if playerId exists on team.
    // check if playerId is captain
    // if all checks, delete request to join team.

    // const response = await teamService.(userId, authId, Number(teamId));
    // return handleErrorResponse(response, res);
    return res.status(501).json(APIResponse.NotImplemented());
});

router.post(
    "/teams/:teamId/requests/:userId::accept",
    teamIdParam,
    authIdParam,
    async (req, res) => {
        const { sub: authId = "" } = req.auth?.payload ?? {};
        const { userId, teamId } = req.params;

        const response = await teamService.acceptJoinRequest(userId, authId, Number(teamId));
        return handleErrorResponse(response, res);
    }
);

/** Creates new team */
router.post("/teams", newTeamSchema, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const divisionId = req.body.divisionId;
    const team = new Team(req.body);

    console.log("team", team);
    console.log("id", divisionId);

    const response = await teamService.createTeam(team, divisionId, sub);

    return handleErrorResponse(response, res, 201);

    return res.json(APIResponse.NotImplemented());
});

router.get("/teams/:teamId", teamIdParam, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const { teamId } = req.params;

    const response = await teamService.findTeamById(Number(teamId), sub);
    return handleErrorResponse(response, res);
});

router
    .route("/teams/:teamId/players")
    .get(teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        // const response = await
        return res.status(501).json(APIResponse.NotImplemented());
    })
    .post(teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.joinTeam(sub, Number(teamId));
        return handleErrorResponse(response, res);
    });

router
    .route("/teams/:teamId/players/:userId")
    /** Remove player from team */
    .delete(authIdParam, teamIdParam, async (req, res) => {
        const { teamId, userId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.kickPlayerFromTeam(userId, Number(teamId), sub);
        return handleErrorResponse(response, res, 204);
    })
    /** Updates player role on team */
    .put(authIdParam, teamIdParam, teamRoleBody, async (req, res) => {
        const { teamId, userId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};
        const { role } = req.body;

        const response = await teamService.updatePlayerRoleOnTeam(
            userId,
            Number(teamId),
            sub,
            role
        );

        return handleErrorResponse(response, res);
    });

router.route("/teams/:teamId/contests/games").get(async (req, res) => {
    const { teamId } = req.params;
    const { sub = "" } = req.auth?.payload ?? {};

    console.log("sub", sub);

    const response = await teamService.findContestGamesById(sub, Number(teamId));
    return handleErrorResponse(response, res);
});

export default router;
