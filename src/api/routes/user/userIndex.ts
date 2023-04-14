import express from "express";
import { APIResponse } from "../../../models/APIResponse";
import playerRoute from "./playerRoute";
import teamRoute from "./teamRoute";
import competitionRoute from "./competitionRoute";
import organizationRoute from "./organizationRoute";

const router = express.Router();

router.use(playerRoute);
router.use(teamRoute);
router.use(competitionRoute);
router.use("/organization", organizationRoute);

// catches api user errors and returns a generic error message
router.use(
    (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        if (!req.auth) {
            return res
                .status(401)
                .json(
                    APIResponse.Unauthorized(
                        "No Bearer token provided or it's incorrectly formatted"
                    )
                );
        }

        console.log(err.stack ?? err.message);

        return res.status(500).json(APIResponse.InternalError(err.stack ?? err.message));
    }
);

export default router;
