import express from "express";
import { CompetitionBusinessService } from "../../../business/service/CompetitionBusinessService";
import { Contest } from "../../../models/competition/Contest";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import { newContestSchema } from "../../../utilities/validation/competitionValidation";
import { compIdParam, organizationIdParam } from "../../../utilities/validation/validationSchemas";

const competitionService = new CompetitionBusinessService();

const router = express.Router();

router
    .route("/organizations/:orgId/contests")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        // const response = await competitionService
        const response = true;
        return handleErrorResponse(response, res);
    })
    // TODO: contest validation schema
    .post(organizationIdParam, newContestSchema, async (req, res) => {
        const { orgId } = req.params;
        const b = req.body;

        const contest = new Contest(b);
        const response = await competitionService.createContest(contest, orgId);

        return handleErrorResponse(response, res, 201);
    });

router.get("/contests/:compId/leagues", async (req, res) => {
    const { compId } = req.params;
    const response = await competitionService.findLeaguesByContestId(Number(compId));

    return handleErrorResponse(response, res);
});

// router
//     .route("/contests/:compId")
//     .get(compIdParam, async (req, res) => {
//         const { compId } = req.params;
//     })
//     .patch()
//     .delete();

// router.route("/contests/:compId/leagues").get().post();
// router.route("/leagues/:compId").get().delete();

export default router;
