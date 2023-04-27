import express from "express";
import { CompetitionBusinessService } from "../../../business/service/CompetitionBusinessService";
import { ILeagueNew } from "../../../interfaces/ILeague";
import { Bracket } from "../../../models/competition/Bracket";
import { Contest } from "../../../models/competition/Contest";
import { Division } from "../../../models/competition/Division";
import { League } from "../../../models/competition/League";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
import {
    newContestSchema,
    newLeagueSchema,
} from "../../../utilities/validation/competitionValidation";
import { compIdParam, organizationIdParam } from "../../../utilities/validation/common";

const competitionService = new CompetitionBusinessService();

const router = express.Router();

router
    .route("/organizations/:orgId/contests")
    .get(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        const response = await competitionService.findContestsByOrganizationId(orgId);

        return handleErrorResponse(response, res);
    })
    // TODO: contest validation schema
    .post(organizationIdParam, newContestSchema, async (req, res) => {
        const { orgId } = req.params;
        const b = req.body;

        const contest = new Contest(b);
        console.log(contest);

        const response = await competitionService.createContest(contest, orgId);

        // const response = true;
        return handleErrorResponse(response, res, 201);
    });

// router
//     .route("/contests/:compId")
//     .get(compIdParam, async (req, res) => {
//         const { compId } = req.params;
//     })
//     .patch()
//     .delete();

router
    .route("/contests/:compId/leagues")
    .get(compIdParam, async (req, res) => {
        const { compId } = req.params;
        const response = await competitionService.findContestAndChildrenById(Number(compId));

        return handleErrorResponse(response, res);
    })
    .post(compIdParam, newLeagueSchema, async (req, res) => {
        const { compId } = req.params;

        const leagues = req.body.leagues as ILeagueNew[];

        const formattedLeagues = convertBodyToLeagues(leagues);
        const response = await competitionService.createLeagues(formattedLeagues, Number(compId));

        return handleErrorResponse(response, res, 201);
    });

export function convertBodyToLeagues(leagues: ILeagueNew[]): League[] {
    return leagues.map((league) => {
        const divisionList = league.divisions.map((division) => {
            const bracketList = division.brackets.map((bracket) => {
                return new Bracket(bracket);
            });
            return new Division({ ...division, brackets: bracketList });
        });
        return new League({ ...league, divisions: divisionList });
    });
}
// router.route("/leagues/:compId").get().delete();

export default router;
