import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { body, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { TeamBusinessService } from "../../../business/user/TeamBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { TeamVisibility } from "../../../utilities/enums/teamEnum";
import { validate } from "../../../utilities/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();
const teamService = new TeamBusinessService();

/**
 * possibly use query parameter to filter for active teams
 */
router.get(
    "/organization/:id",
    param("id").isUUID(4).withMessage("id is not uuid format"),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        const response = await teamService.findAllTeamsByOrganizationId(req.params?.id);

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);

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

router.get("/:id", param("id").toInt(), async (req, res) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(req.params?.id)) {
        return APIResponse[400]("id is not a number");
    }

    const response = await teamService.findTeamById(req.params?.id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
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
    res.status(501).json(APIResponse[501]);
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

        const newTeam = {
            name,
            image,
            visibility,
            sport,
        };
        const response = await teamService.createTeam(newTeam, sub!);

        if (response instanceof APIResponse) {
            return response;
        }

        return res.status(201).json(response);
    }
);

export default router;
