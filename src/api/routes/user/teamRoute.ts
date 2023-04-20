import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { body, param, validationResult } from "express-validator";
import { CompetitionBusinessService } from "../../../business/user/CompetitionBusinessService";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { TeamBusinessService } from "../../../business/user/TeamBusinessService";
import { ITeamCreate, ITeamProps } from "../../../interfaces/ITeam";
import { APIResponse } from "../../../models/APIResponse";
import { Team } from "../../../models/Team";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { TeamVisibility } from "../../../utilities/enums/teamEnum";
import { authIdParam, teamRoleBody } from "../../../utilities/validation/common";
import { newTeamSchema } from "../../../utilities/validation/teamValidation";
import { teamIdParam, validate } from "../../../utilities/validation/validationSchemas";
import { compIdParam } from "../../../utilities/validation/common";
import { checkJwt } from "../../../utilities/checkJwt";

const router = express.Router();

const playerService = new PlayerBusinessService();
const teamService = new TeamBusinessService();
const competitionService = new CompetitionBusinessService();

router
    .route("/teams/:teamId/requests")
    /** creates request to join team */
    .post(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.requestToJoinTeam(sub, Number(teamId));
        return handleErrorResponse(response, res, 201);
    })
    /** gets all join requests for team */
    .get(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.findAllJoinRequests(Number(teamId), sub);
        return handleErrorResponse(response, res);
    });

router.delete(
    "/teams/:teamId/requests/:userId",
    checkJwt,
    teamIdParam,
    authIdParam,
    async (req, res) => {
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
    }
);

router.post(
    "/teams/:teamId/requests/:userId::accept",
    checkJwt,
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
router.post("/teams", checkJwt, newTeamSchema, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const body = req.body;

    const divisionId = req.body.divisionId;

    const team = new Team(body);
    console.log("team", team);
    console.log("id", divisionId);

    const response = await teamService.createTeam(team, divisionId, sub);

    return handleErrorResponse(response, res, 201);

    return res.json(APIResponse.NotImplemented());
});

router.get("/teams/:teamId", checkJwt, teamIdParam, async (req, res) => {
    const { teamId } = req.params;

    const response = await teamService.findTeamById(Number(teamId));

    return handleErrorResponse(response, res);
});

router
    .route("/teams/:teamId/players")
    .get(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        // const response = await
        return res.status(501).json(APIResponse.NotImplemented());
    })
    .post(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.joinTeam(sub, Number(teamId));

        return handleErrorResponse(response, res);
    });

router
    .route("/teams/:teamId/players/:userId")
    /** Remove player from team */
    .delete(checkJwt, authIdParam, teamIdParam, async (req, res) => {
        const { teamId, userId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await teamService.kickPlayerFromTeam(userId, Number(teamId), sub);
        return handleErrorResponse(response, res, 204);
    })
    /** Updates player role on team */
    .put(checkJwt, authIdParam, teamIdParam, teamRoleBody, async (req, res) => {
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

router.route("/teams/:teamId/contests/games").get(checkJwt, async (req, res) => {
    const { teamId } = req.params;
    const { sub = "" } = req.auth?.payload ?? {};

    console.log("sub", sub);

    const response = await teamService.findContestGamesById(sub, Number(teamId));
    return handleErrorResponse(response, res);
});

export default router;
