import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { IPlayerProps, PlayerPatch } from "../../../interfaces/IPlayer";
import { APIResponse } from "../../../models/APIResponse";
import { Player } from "../../../models/Player";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { patchPersonSchema } from "../../../utilities/validation/playerValidation";
import { authIdParam } from "../../../utilities/validation/validationSchemas";
// import { finishProfileSchema } from "../../../utilities/validation/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();

// todo: add validation schema, there should already be one
// todo: add param for organization
// router.post("/organization/:id", checkJwt, async (req, res) => {
//     const { sub } = req.auth!.payload;
//     const { id } = req.params;

//     const reqBody = req.body;

//     const response = await playerService.completePlayerProfile(
//         Player.PlayerNew({
//             authId: sub!,
//             firstName: reqBody.firstName,
//             lastName: reqBody.lastName,
//             language: reqBody.language,
//             emailAddress: reqBody.emailAddress,
//             gender: reqBody.gender,
//             dob: reqBody.dateOfBirth,
//             visibility: reqBody.visibility,
//             graduationTerm: reqBody.graduationTerm,
//             image: reqBody.image,
//         }),
//         id
//     );

//     if (response instanceof APIResponse) {
//         return res.status(response.statusCode).json(response);
//     }

//     return res.status(201).json(req.body);
// });

router
    .route("/players")
    .get(checkJwt, async (req, res) => {
        // ** i cant figure this out here **
        const { sub = "" } = req.auth!.payload;

        // i tried, but didn't work
        // const { sub = "" } = req.auth?.payload || "";
        //
        // this gets mad because payload doesn't exist on {} obviously
        // const { sub } = req.auth || {}.payload;
        // I dont know how to get this to work

        const response = await playerService.findPlayerProfile(sub);
        // const response = true;
        return handleErrorResponse(response, res);
    })
    .patch(checkJwt, patchPersonSchema, async (req, res) => {
        const { sub = "" } = req.auth!.payload;
        const b = req.body;

        // REVIST - small issue here, additional fields can be passed into the request body
        // and change fields that are supposed to be touched
        const player = new Player(b);
        console.log("artic", player);

        player.setAuthId(sub);

        const response = await playerService.patchPlayer(player);

        return handleErrorResponse(response, res);
    });

router.get("/players/search/:userId", checkJwt, authIdParam, async (req, res) => {
    const { sub = "" } = req.auth!.payload;
    const { userId } = req.params;

    const response = await playerService.findPlayerById(sub, userId);
    return handleErrorResponse(response, res);
});

router.get("/players/teams", checkJwt, async (req, res) => {
    const { sub = "" } = req.auth!.payload;
    const response = await playerService.findPlayerTeams(sub);

    return handleErrorResponse(response, res);
});

export default router;
