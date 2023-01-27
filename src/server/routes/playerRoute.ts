import express from "express";
import { body, checkSchema, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import { newPersonSchema, patchPersonSchema, validate } from "../../utilities/validationSchemas";

const router = express.Router();

const playerService = new PlayerBusinessService();

router.get(
    "/organization/:id",

    param("id").isUUID().withMessage("not in UUI format"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        return res.status(501).json(APIResponse[501]);
    }
);

router.get("/:id", async (req, res) => {
    const response = await playerService.findPlayerById(req.params.id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

router.post("/", validate(newPersonSchema), async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        const errorResponse = errors.array()[0].msg;
        return res.status(400).json(APIResponse[400](errorResponse));
    }

    const auth = req.auth?.payload;
    const authId = auth?.sub;

    const reqBody = req.body;

    const response = await playerService.createPlayer(
        new Player({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            authId: authId!,
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            language: reqBody.language,
            emailAddress: reqBody.emailAddress,
            role: null,
            gender: reqBody.gender,
            dob: reqBody.dateOfBirth,
            visibility: reqBody.visibility,
            graduationTerm: reqBody.graduationTerm,
            image: reqBody.image,
            status: null,
            dateCreated: null,
            organizationId: reqBody.organizationId,
        })
    );
    return res.status(200).json(response);
});

router.patch("/", patchPersonSchema, async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        const errorResponse = errors.array()[0].msg;
        return res.status(400).json(APIResponse[400](errorResponse));
    }

    console.log(req.auth);

    // grab the authId of the user from the authorization token
    if (req.auth === undefined) {
        return res.status(401).json();
    }
    const auth = req.auth.payload;
    const { sub } = auth;

    const reqBody = req.body;

    const response = await playerService.completePlayerProfile(
        new Player({
            authId: sub,
            // authId: reqBody.id,
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            language: reqBody.language,
            emailAddress: reqBody.emailAddress,
            role: null,
            gender: reqBody.gender,
            dob: reqBody.dateOfBirth,
            visibility: reqBody.visibility,
            graduationTerm: reqBody.graduationTerm,
            image: reqBody.image,
            status: reqBody.status,
            dateCreated: null,
            organizationId: reqBody.organizationId,
        })
    );

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(req.body);
});

export default router;
