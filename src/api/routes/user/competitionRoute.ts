import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { CompetitionBusinessService } from "../../../business/user/CompetitionBusinessService";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { checkJwt } from "../../../utilities/checkJwt";
import { compIdParam } from "../../../utilities/validation/common";

const router = express.Router();

const competitionService = new CompetitionBusinessService();

router.get("/contests", checkJwt, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const response = await competitionService.findAllContestsAndChildren(sub);

    return handleErrorResponse(response, res);
});

router.get("/contests/:compId", checkJwt, compIdParam, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const { compId } = req.params;

    const response = await competitionService.findContestAndChildrenById(Number(compId), sub);
    return handleErrorResponse(response, res);
});

export default router;
