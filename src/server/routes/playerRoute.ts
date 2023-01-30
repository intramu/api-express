import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { body, checkSchema, param, validationResult } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import {
    finishProfileSchema,
    newPersonSchema,
    patchPersonSchema,
    validate,
} from "../../utilities/validationSchemas";

const router = express.Router();

const checkJwt = auth({
    audience: "https://server-authorization/",
    issuerBaseURL: "https://dev-5p-an07k.us.auth0.com",
});

const playerService = new PlayerBusinessService();

router.get(
    "/organization/:id",

    param("id").isUUID().withMessage("not in UUI format"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = errors.array()[0].msg;
            return res.status(400).json(APIResponse[400](errorResponse));
        }

        return res.status(501).json(APIResponse[501]);
    }
);

router.get("/", checkJwt, async (req, res) => {
    if (req.auth === undefined) {
        return res.status(401).json("No token");
    }

    const { sub } = req.auth.payload;
    const response = await playerService.findPlayerById(sub!);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

router.post("/", validate(newPersonSchema), async (req: express.Request, res: express.Response) => {
    if (req.auth === undefined) {
        return res.status(401).json();
    }
    const { sub } = req.auth.payload;

    const reqBody = req.body;

    const response = await playerService.createPlayer(
        new Player({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            authId: sub!,
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

router.patch("/finish", validate(finishProfileSchema()), async (req, res) => {
    // grab the authId of the user from the authorization token
    console.log("heaven");

    if (req.auth === undefined) {
        return res.status(401).json("bitch");
    }

    console.log("maybe");

    const {
        firstName,
        lastName,
        emailAddress,
        language,
        dateOfBirth,
        gender,
        graduationTerm,
        visibility,
        organizationId,
    } = req.body;

    const { sub } = req.auth.payload;

    const response = await playerService.completePlayerProfile(
        new Player({
            authId: sub!,
            firstName,
            lastName,
            language,
            emailAddress,
            role: null,
            dateCreated: null,
            status: null,
            organizationId,
            gender,
            dob: dateOfBirth,
            visibility,
            graduationTerm,
            image: "",
        })
    );

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

router.patch("/", patchPersonSchema, async (req: express.Request, res: express.Response) => {
    // grab the authId of the user from the authorization token
    if (req.auth === undefined) {
        return res.status(401).json();
    }
    const { sub } = req.auth.payload;

    const reqBody = req.body;

    const response = await playerService.completePlayerProfile(
        new Player({
            authId: sub!,
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
