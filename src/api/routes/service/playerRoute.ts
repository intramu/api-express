import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Player } from "../../../models/Player";
import {
    authIdParam,
    newPersonSchema,
    organizationIdParam,
    validate,
} from "../../../utilities/validationSchemas";
import { PlayerBusinessService } from "../../../business/service/PlayerBusinessService";
import { isErrorResponse } from "../../../utilities/apiFunctions";

const router = express.Router();

const playerService = new PlayerBusinessService();
const organizationService = new OrganizationBusinessService();

/** feature: could be changed to allow additional sudo admins for
 * maintenance without having too much access */
// scope for auth0
const sudoScoped = requiredScopes("all: application");

router.route("/players").get(async (req, res, next) => {
    const response = await playerService.findAllPlayers();

    return isErrorResponse(response, res);
    // res.locals.response = response;

    // return next();

    // if (response instanceof APIResponse) {
    //     return res.status(response.statusCode).json(response);
    // }

    // return res.status(200).json(response);
});

router
    .route("/players/:userId")
    .get(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await playerService.findPlayerById(userId);

        return isErrorResponse(response, res);
    })
    .delete(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await playerService.removePlayerById(userId);

        return isErrorResponse(response, res, 204);
    })
    .patch(authIdParam, async (req, res) => {
        const { userId } = req.params;

        const b = req.body as Player;
        const player: Player = b;
        player.setAuthId(userId);
        console.log("here");

        const response = await playerService.patchPlayer(player);
        return isErrorResponse(response, res);
    });

// const post = newPersonSchema
router
    .route("/organizations/:orgId/players")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await playerService.findAllPlayersByOrganizationId(orgId);

        return isErrorResponse(response, res);
    })
    // TODO: add organization id UUID enforcement
    .post(validate(newPersonSchema()), async (req, res) => {
        const { orgId } = req.params;
        // get player object

        // const response = await playerService.createPlayerByOrganizationId(player, id);
        const response = APIResponse[501]();
        return res.status(501).json(response);
        // return isErrorResponse(response, res, 201);
    });

router.get("/players/:userId/invites", authIdParam, (req, res) => {
    const { userId } = req.params;
});

export default router;
