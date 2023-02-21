import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { body, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { TeamBusinessService } from "../../../business/user/TeamBusinessService";
import { ITeamCreate } from "../../../interfaces/ITeam";
import { APIResponse } from "../../../models/APIResponse";
import { Team } from "../../../models/Team";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { TeamVisibility } from "../../../utilities/enums/teamEnum";
import { authIdParam, teamRoleBody } from "../../../utilities/validation/common";
import { teamIdParam, validate } from "../../../utilities/validation/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();
const teamService = new TeamBusinessService();

router.get(
    "/organization/:id/active",
    param("id").isUUID(4).withMessage("id is not uuid format"),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        const response = await teamService.findAllActiveTeams(req.params?.id);

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);

router.put(
    "/:id/join",
    validate([
        body("teamId").notEmpty().withMessage("value 'teamId' is missing").trim().escape().toInt(),
    ]),
    async (req, res) => {
        if (req.auth === undefined) {
            return res.status(401).json("No token found");
        }
        const { teamId } = req.body;
        const { sub } = req.auth.payload;

        const response = await teamService.joinTeam(sub!, Number(teamId));

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);
router.put(
    "/:id/accept",
    validate([
        body("requesteeId")
            .notEmpty()
            .withMessage("value 'requesteeId' is missing")
            .trim()
            .escape(),
        body("teamId").notEmpty().withMessage("value 'teamId' is missing").trim().escape(),
    ]),
    async (req, res) => {
        if (req.auth === undefined) {
            return res.status(401).json("No token found");
        }

        const { requesteeId, teamId } = req.params;
        const { sub } = req.auth.payload;

        const response = teamService.acceptJoinRequest(requesteeId, sub!, Number(teamId));

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);

router.post(
    "/:id/request",
    validate([
        body("teamId").notEmpty().withMessage("value 'teamId' is missing").trim().escape().toInt(),
    ]),
    checkJwt,
    async (req, res) => {
        if (req.auth === undefined) {
            return res.status(401).json("No token found");
        }
        const { teamId } = req.body;
        const { sub } = req.auth.payload;

        const response = await teamService.requestToJoinTeam(sub!, Number(teamId));

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(201).json(response);
    }
);
router.post("/teams", checkJwt, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const b = req.body as ITeamCreate;

    const team = new Team({
        name: b.name,
        image: b.image,
        sport: b.sport,
        visibility: b.visibility,
        bracketId: b.bracketId,
    });

    const response = await teamService.createTeam(team, sub);

    return handleErrorResponse(response, res, 201);
});

router.get("/teams/:teamId", checkJwt, teamIdParam, async (req, res) => {
    const { teamId } = req.params;

    const response = await teamService.findTeamById(Number(teamId));

    return handleErrorResponse(response, res);
});

router
    .route("/teams/:teamId/requests")
    .get(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth!.payload;

        return res.status(501).json(APIResponse.NotImplemented());
    })
    .post(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth!.payload;

        const response = await teamService.requestToJoinTeam(sub, Number(teamId));

        return handleErrorResponse(response, res, 201);
    })
    .delete(checkJwt, teamIdParam, async (req, res) => {
        // from player
        // check teamjoinrequests for playerId and teamId combo.
        // if exists, delete request to join team
        // from captain
        // if doesn't exist, check if playerId exists on team.
        // check if playerId is captain
        // if all checks, delete request to join team.

        const { teamId } = req.params;

        // can be either requesting player or captain / co-captain, calling delete
        const { sub = "" } = req.auth!.payload;

        return res.status(501).json(APIResponse.NotImplemented());
    });

router
    .route("/teams/:teamId/players")
    .get(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth!.payload;

        // const response = await
        return res.status(501).json(APIResponse.NotImplemented());
    })
    .post(checkJwt, teamIdParam, async (req, res) => {
        const { teamId } = req.params;
        const { sub = "" } = req.auth!.payload;

        const response = await teamService.joinTeam(sub, Number(teamId));

        return handleErrorResponse(response, res);
    });

router
    .route("/teams/:teamId/players/:userId")
    .delete(checkJwt, authIdParam, teamIdParam, async (req, res) => {
        const { teamId, userId } = req.params;
        const { sub = "" } = req.auth!.payload;

        const response = await teamService.kickPlayerFromTeam(userId, Number(teamId), sub);
        return handleErrorResponse(response, res, 204);
    })
    .put(checkJwt, authIdParam, teamIdParam, teamRoleBody, async (req, res) => {
        const { teamId, userId } = req.params;
        const { sub = "" } = req.auth!.payload;
        const { role } = req.body;

        const response = await teamService.updatePlayerRoleOnTeam(
            userId,
            Number(teamId),
            sub,
            role
        );

        return handleErrorResponse(response, res);
    });

// router.get("/", async (req, res) => {
//     const { sub } = req.auth!.payload;

//     const response = await playerService.findAllActiveTeams();

//     if (response instanceof APIResponse) {
//         return res.status(response.statusCode).json(response);
//     }

//     return res.status(200).json(response);
// });

router.put("/", async (req, res) => {
    res.status(501).json(APIResponse.NotImplemented());
});

router.post(
    "/",
    validate([
        body("name").notEmpty().withMessage("value 'name' is missing").trim().escape(),
        body("image").isEmpty().withMessage("value 'image' not supported"),
        body("visibility")
            .notEmpty()
            .withMessage("value 'visibility' is missing")
            .toUpperCase()
            .isIn([TeamVisibility.PUBLIC, TeamVisibility.PRIVATE])
            .withMessage(
                `valid visibility options are [${TeamVisibility.PUBLIC}, ${TeamVisibility.PRIVATE} ]`
            ),
        body("sport").notEmpty().withMessage("sport is missing").trim().escape(),
    ]),
    checkJwt,
    async (req, res) => {
        if (req.auth === undefined) {
            return res.status(401).json("No token found");
        }
        const { name, image, visibility, sport } = req.body;
        const { sub } = req.auth.payload;

        // REVISIT
        const response = await teamService.createTeam(newTeam, sub!);

        if (response instanceof APIResponse) {
            return response;
        }

        return res.status(201).json(response);
    }
);

export default router;
