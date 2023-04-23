import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Player } from "../../../models/Player";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { organizationIdParam } from "../../../utilities/validation/common";
import {
    newPlayerSchemaUser,
    patchPersonSchema,
} from "../../../utilities/validation/playerValidation";
import { authIdParam, teamIdParam } from "../../../utilities/validation/validationSchemas";
import { OrganizationBusinessService } from "../../../business/user/OrganizationBusinessService";
import { checkJwt } from "../../../utilities/authUtilities";
// import { finishProfileSchema } from "../../../utilities/validation/validationSchemas";

const router = express.Router();

const playerService = new PlayerBusinessService();
const organizationService = new OrganizationBusinessService();

router.use(checkJwt);

// todo: add validation schema, there should already be one
// todo: add param for organization
router.post(
    "/organizations/:orgId/players",
    checkJwt,
    organizationIdParam,
    newPlayerSchemaUser,
    async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};
        const { orgId } = req.params;

        const player = new Player({ authId: sub, ...req.body });

        const response = await playerService.createPlayer(player, orgId);
        return handleErrorResponse(response, res);
    }
);

router.route("/organizations/list").get(async (req, res) => {
    const response = await organizationService.findOrganizationSignupList();

    return handleErrorResponse(response, res);
});

router
    .route("/players")
    .get(checkJwt, async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await playerService.findPlayerProfile(sub);
        return handleErrorResponse(response, res);
    })
    .patch(checkJwt, patchPersonSchema, async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};

        // REVIST - small issue here, additional fields can be passed into the request body
        // and change fields that aren't supposed to be touched
        const player = new Player({ authId: sub, ...req.body });
        console.log("artic", player);

        const response = await playerService.patchPlayer(player);

        return handleErrorResponse(response, res);
    });

router.get("/players/requests", checkJwt, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const response = await playerService.findAllPlayerInvitesById(sub);

    return handleErrorResponse(response, res);
});

router.post(
    "/players/:userId/requests/teams/:teamId",
    checkJwt,
    teamIdParam,
    authIdParam,
    async (req, res) => {
        const { userId, teamId } = req.params;
        const { sub = "" } = req.auth?.payload ?? {};

        const response = await playerService.invitePlayerToTeam(sub, userId, Number(teamId));
        return handleErrorResponse(response, res, 201);
    }
);

router.post("/players/requests/teams/:teamId::accept", checkJwt, teamIdParam, async (req, res) => {
    const { teamId } = req.params;
    const { sub = "" } = req.auth?.payload ?? {};

    const response = await playerService.acceptTeamInvite(sub, Number(teamId));
    return handleErrorResponse(response, res);
});

router.delete("/players/requests/teams/:teamId", async (req, res) => {
    return res.status(501).json(APIResponse.NotImplemented);
});

// ######### Combine these two routes
// router.get("/players/search/:userId", checkJwt, authIdParam, async (req, res) => {
//     const { sub = "" } = req.auth?.payload ?? {};
//     const { userId } = req.params;

//     const response = await playerService.findPlayerById(sub, userId);
//     return handleErrorResponse(response, res);
// });

router.get("/players/search", async (req, res) => {
    const { name, userId } = req.query;
    console.log(name);

    if (name) {
        const response = await playerService.findPlayerByNameInOrganization(
            "auth0|62760b4733c477006f82c56d",
            name as string
        );
        return res.status(200).json(response);
    }

    if (userId) {
        const response = await playerService.findPlayerById(
            "auth0|62760b4733c477006f82c56d",
            userId as string
        );
        return res.status(200).json(response);
    }

    return res.status(400).json(APIResponse.BadRequest("No query parameters provided"));
});

router.get("/players/teams", checkJwt, async (req, res) => {
    const { sub = "" } = req.auth!.payload;
    const response = await playerService.findPlayersTeams(sub);

    return handleErrorResponse(response, res);
});

router.get("/organizations/signup/list", async (req, res) => {
    const { sub = "" } = req.auth!.payload;
    const response = await organizationService.findOrganizationByPlayerId(sub);

    return handleErrorResponse(response, res);
});

export default router;
