import express from "express";
import { body, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { Visibility } from "../../utilities/enums";

const router = express.Router();

const playerService = new PlayerBusinessService();

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

        const response = await playerService.findAllTeamsByOrganizationId(req.params?.id);

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

        const response = await playerService.findAllActiveTeams(req.params?.id);

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);

router.get("/:id", param("id").toInt(), async (req, res) => {
    if (isNaN(req.params?.id)) {
        return APIResponse[400]("id is not a number");
    }

    const response = await playerService.findTeamById(req.params?.id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

router.put("/", async (req, res) => {
    res.status(501).json(APIResponse[501]);
});

router.post(
    "/",
    body("name").notEmpty().withMessage("name is missing").trim().escape(),
    body("image").isEmpty().withMessage("image not supported"),
    body("visibility")
        .toUpperCase()
        .isIn([Visibility.OPEN, Visibility.CLOSED, Visibility.PRIVATE])
        .withMessage(
            `valid visibility options are [${Visibility.CLOSED}, ${Visibility.OPEN}, ${Visibility.PRIVATE}]`
        ),
    body("sport").notEmpty().withMessage("sport is missing").trim(),
    body("organizationId").notEmpty().withMessage("organization id is missing").trim(),
    async (req, res) => {
        const errors = validationResult(req);
        const errorResponse = errors.array()[0].msg;

        if (!errors.isEmpty()) {
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        const { reqBody } = req.body;

        const team = new Team(
            null,
            reqBody.name,
            null,
            null,
            null,
            null,
            body.visibility,
            body.sport,
            null,
            null,
            null,
            null,
            [],
            body.organizationId,
            null
        );
        const response = await playerService.createTeam(team);

        if (response instanceof APIResponse) {
            return response;
        }

        return res.status(201).json(response);
    }
);

export default router;
