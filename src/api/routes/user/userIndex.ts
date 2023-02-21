import express from "express";
import { APIResponse } from "../../../models/APIResponse";
import playerRoute from "./playerRoute";
import teamRoute from "./teamRoute";

const router = express.Router();

router.use(playerRoute);
router.use(teamRoute);

// catches api user errors and returns a generic error message
router.use(
    (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        if (!req.auth) {
            return res.status(401).json(APIResponse.Unauthorized("Token Error"));
        }

        return res.status(500).json(APIResponse.InternalError(err.stack ?? err.message));
    }
);

export default router;
