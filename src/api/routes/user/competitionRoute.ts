import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { CompetitionBusinessService } from "../../../business/user/CompetitionBusinessService";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { checkJwt } from "../../../utilities/checkJwt";
import { compIdParam } from "../../../utilities/validation/common";
import { Contest } from "../../../models/competition/Contest";
import { convertBodyToLeagues } from "../service/contestRoute";
import { APIResponse } from "../../../models/APIResponse";

const router = express.Router();

const competitionService = new CompetitionBusinessService();

router
    .route("/contests")
    .get(checkJwt, async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};
        const response = await competitionService.findAllContestsAndChildren(sub);

        return handleErrorResponse(response, res);
    })
    .post(checkJwt, async (req, res) => {
        const { sub = "" } = req.auth?.payload ?? {};

        const contest = new Contest(req.body);
        const leagues = convertBodyToLeagues(req.body.leagues);

        const contestResponse = await competitionService.createContest(contest, sub);
        if (contestResponse instanceof APIResponse) {
            return res.status(contestResponse.statusCode).json(contestResponse.message);
        }

        const response = await competitionService.createLeagues(
            leagues,
            contestResponse.getId(),
            sub
        );
        return handleErrorResponse(response, res, 201);
    });

router.get("/contests/:compId", checkJwt, compIdParam, async (req, res) => {
    const { sub = "" } = req.auth?.payload ?? {};
    const { compId } = req.params;

    const response = await competitionService.findContestAndChildrenById(Number(compId), sub);
    return handleErrorResponse(response, res);
});

export default router;
