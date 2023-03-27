import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Player } from "../../../models/Player";
import {
    authIdParam,
    organizationIdParam,
    validate,
} from "../../../utilities/validation/validationSchemas";
import { PlayerBusinessService } from "../../../business/service/PlayerBusinessService";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { newPersonSchema } from "../../../utilities/validation/playerValidation";
import { IPlayerProps } from "../../../interfaces/IPlayer";

const router = express.Router();

const playerService = new PlayerBusinessService();
const organizationService = new OrganizationBusinessService();

/** feature: could be changed to allow additional sudo admins for
 * maintenance without having too much access */
// scope for auth0
const sudoScoped = requiredScopes("all: application");

router.route("/players").get(async (req, res) => {
    const response = await playerService.findAllPlayers();

    return handleErrorResponse(response, res);
});

router
    .route("/players/:userId")
    .get(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await playerService.findPlayerById(userId);

        return handleErrorResponse(response, res);
    })
    .delete(authIdParam, async (req, res) => {
        const { userId } = req.params;
        const response = await playerService.removePlayerById(userId);

        return handleErrorResponse(response, res, 204);
    })
    .patch(authIdParam, async (req, res) => {
        const { userId } = req.params;

        const b = req.body as Player;
        const player: Player = b;
        player.setAuthId(userId);

        const response = await playerService.patchPlayer(player);
        return handleErrorResponse(response, res);
    });

router
    .route("/organizations/:orgId/players")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await playerService.findAllPlayersByOrganizationId(orgId);

        return handleErrorResponse(response, res);
    })
    .post(organizationIdParam, newPersonSchema, async (req, res) => {
        const { orgId } = req.params;
        const b = req.body as IPlayerProps;

        const player = new Player(b);
        const response = await playerService.createPlayerByOrganizationId(player, orgId);

        return handleErrorResponse(response, res, 201);
    });

router.post("/organizations/:orgId/players/auth0", async (req, res) => {
    const { orgId } = req.params;
    const b = req.body as IPlayerProps;

    const player = new Player(b);
    const response = await playerService.createPlayerWithAuth0Account(player, orgId);

    return handleErrorResponse(response, res, 201);
});

router.get("/players/:userId/invites", authIdParam, (req, res) => {
    const { userId } = req.params;
});

export default router;
