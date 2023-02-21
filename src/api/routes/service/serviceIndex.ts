import express from "express";
import { APIResponse } from "../../../models/APIResponse";
import playerServiceRoute from "./playerRoute";
import teamServiceRoute from "./teamRoute";
import adminServiceRoute from "./adminRoute";
import contestServiceRoute from "./contestRoute";

const router = express.Router();

router.use(playerServiceRoute);
router.use(teamServiceRoute);
router.use(adminServiceRoute);
router.use(contestServiceRoute);

// catches api service errors and returns the error message
router.use(
    (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        return res.status(500).json(APIResponse.InternalError(err.stack ?? err.message));
    }
);

export default router;
