import express from "express";
import { param } from "express-validator";
import { requiredScopes } from "express-oauth2-jwt-bearer";

import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { PlayerNew } from "../../../interfaces/Player";
import { APIResponse } from "../../../models/APIResponse";
import { Organization } from "../../../models/Organization";
import { Player } from "../../../models/Player";
import {
    newContestSchema,
    newOrganizationSchema,
    newPersonSchema,
    validate,
} from "../../../utilities/validationSchemas";
import { Admin } from "../../../models/Admin";

const router = express.Router();

const organizationService = new OrganizationBusinessService();
// const playerService = new PlayerBusinessService();

// TODO: add scopes to these methods
router
    .route("/")
    // TODO: new endpoint for creating organizations with and without auth0 account
    .post(validate(newOrganizationSchema()), async (req, res) => {
        const {
            admin: { firstName, lastName, language, emailAddress },
            organization: { name, info, mainColor },
        } = req.body;

        const organization = new Organization({
            id: "",
            name,
            image: "",
            info,
            mainColor,
            approvalStatus: null,
            dateCreated: null,
        });

        const admin = {
            firstName,
            lastName,
            language,
            emailAddress,
        };

        const response = await organizationService.createOrganizationWithAuth0Account(
            organization,
            admin
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).send(response);
        }

        return res.status(201).json(response);
    })
    // todo: paging
    .get(async (req, res) => {
        const response = await organizationService.findAllOrganizations();

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    })
    // todo: validation schema
    // todo: business service needs patch method
    .patch(async (req, res) => {
        // const response = await organizationService.
        return res.status(501).json(APIResponse[501]());
    });

router.get(
    "/:id",
    validate([param("id").isUUID().withMessage("organization id requires UUID")]),
    async (req, res) => {
        const { id } = req.params;

        const response = await organizationService.findOrganizationById(id);
        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    }
);

const test = newPersonSchema();
test.push(param("id").isUUID().withMessage("organization id requires UUID"));

router
    .route("/:id/players")
    .get(
        validate([param("id").isUUID().withMessage("organization id requires UUID")]),
        async (req, res) => {
            const { id } = req.params;

            const response = await organizationService.findAllPlayersByOrganizationId(id);
            if (response instanceof APIResponse) {
                return res.status(response.statusCode).json(response);
            }

            return res.status(200).json(response);
        }
    )
    .post(validate(test), async (req, res) => {
        const { id } = req.params;
        const b = <PlayerNew>req.body;

        const response = await organizationService.createPlayerByOrganizationId(
            Player.PlayerNew({
                authId: b.authId,
                firstName: b.firstName,
                lastName: b.lastName,
                emailAddress: b.emailAddress,
                language: b.language,
                dob: b.dateOfBirth,
                gender: b.gender,
                graduationTerm: b.graduationTerm,
                visibility: b.visibility,
                image: b.image,
            }),
            id
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(201).json(response);
    })
    // REVISIT - no longer needs organization id
    .patch(validate(test), async (req, res) => {
        const { id } = req.params;
        const b = <PlayerNew>req.body;

        const response = await organizationService.patchPlayer(
            Player.Player({
                authId: b.authId,
                firstName: b.firstName,
                lastName: b.lastName,
                language: b.language,
                emailAddress: b.emailAddress,
                dob: b.dateOfBirth,
                gender: b.gender,
                visibility: b.visibility,
                status: b.status,
                dateCreated: null,
                image: b.image,
                graduationTerm: b.graduationTerm,
            })
        );

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }

        return res.status(200).json(response);
    });

router.route("/:id/admins").get(async (req, res) => {
    const { id } = req.params;
    const response = organizationService.findAllAdminsByOrganizationId(id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

const contest = newContestSchema();
contest.push(param("id").isUUID().withMessage("organization id requires UUID"));
// router.post("/:id/contest", validate(contest), async (req, res) => {});

// catches this routes errors and returns the error message
router.use(
    (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        return res.status(500).json(APIResponse[500](err.message));
    }
);

export default router;
