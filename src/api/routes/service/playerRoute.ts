import express from "express";
import { param } from "express-validator";
import { requiredScopes } from "express-oauth2-jwt-bearer";

import { OrganizationBusinessService } from "../../../business/service/OrganizationBusinessService";
import { PlayerNew } from "../../../interfaces/Player";
import { APIResponse } from "../../../models/APIResponse";
import { Organization } from "../../../models/Organization";
import { Player } from "../../../models/Player";
import {
    newOrganizationSchema,
    newPersonSchema,
    validate,
} from "../../../utilities/validationSchemas";
import { PlayerBusinessService } from "../../../business/service/PlayerBusinessService";

const router = express.Router();

const playerService = new PlayerBusinessService();
const organizationService = new OrganizationBusinessService();

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

// TODO: add length validation on param
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await playerService.findPlayerById(id);

    return isErrorResponse(response, res);
});

router.use((req, res, next) => {
    const { response, status } = res.locals;
    // console.log(response);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(status ?? 200).json(response);
});

const isErrorResponse = (response: any, res: express.Response, statusCode?: number) => {
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(statusCode ?? 200).json(response);
};

router.get("*", (req, res) => {
    console.log("404 Not Found | Request URL: ", req.url);
    res.status(404).send("404 Not Found. Sorry not sure what you were looking for");
});

// router.use(
//     (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//         console.log("now", err);

//         if (res.headersSent) {
//             return next(err);
//         }

//         if (err instanceof APIResponse) {
//             return res.status(err.statusCode).send(err);
//         }

//         return res.status(500).json(APIResponse[500](err.message));
//     }
// );

export default router;
