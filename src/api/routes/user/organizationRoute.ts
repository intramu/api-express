import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { check } from "express-validator";
import { OrganizationBusinessService } from "../../../business/user/OrganizationBusinessService";
import { PlayerBusinessService } from "../../../business/user/PlayerBusinessService";
import { APIResponse } from "../../../models/APIResponse";
import { Bracket } from "../../../models/competition/Bracket";
import { Division } from "../../../models/competition/Division";
import { League } from "../../../models/competition/League";
import { TimeSlot } from "../../../models/competition/TimeSlot";
import { BracketNewInterface } from "../../../interfaces/IBracket";
import { DivisionNewInterface } from "../../../interfaces/IDivision";
import { LeagueNewInterface } from "../../../interfaces/ILeague";
import { TimeSlotInterface } from "../../../interfaces/TimeSlot";
import {
    newContestSchema,
    newLeagueSchema,
    validate,
} from "../../../utilities/validation/validationSchemas";

import { Organization } from "../../../models/Organization";
import { Contest } from "../../../models/competition/Contest";
import { CompetitionBusinessService } from "../../../business/user/CompetitionBusinessService";

const router = express.Router();

const organizationService = new OrganizationBusinessService();
const playerService = new PlayerBusinessService();
const competitionService = new CompetitionBusinessService();

const adminScoped = requiredScopes("all: organization");

router.route("/admins");
/** Gets all admins in organization */
// .get(async (req,res)=>{})
// .post(async (req,res)=>)

router.post("/contest", validate(newContestSchema()), async (req, res) => {
    const {
        name,
        visibility,
        status,
        startDate,
        endDate,
        playoff,
        playoffType,
        playoffSeedingType,
        contestType,
    } = req.body;
    // const {sub} = req.auth!.payload;

    const contest = new Contest({
        id: 0,
        name,
        visibility,
        status,
        dateCreated: null,
        startDate,
        endDate,
        playoff,
        playoffType,
        playoffSeedingType,
        contestType,
        leagues: [],
        organizationId: "",
    });
    const response = await competitionService.createContest(contest, "test1");

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(201).json(response);
});

router.post("/leagues", validate(newLeagueSchema()), async (req, res) => {
    const { leagues, contestId } = req.body;
    // const { sub } = req.auth!.payload;

    // convert json to list of objects
    const leagueList: League[] = leagues.map((league: LeagueNewInterface) => {
        // iterates through all divisions on league
        const divisions = league.divisions.map((division: DivisionNewInterface) => {
            // iterates through all brackets on division
            const brackets = division.brackets.map((bracket: BracketNewInterface) => {
                // iterates through timeslots for each bracket
                const timeSlots = bracket.timeSlots.map(
                    (timeSlot: TimeSlotInterface) =>
                        new TimeSlot({
                            id: 0,
                            startTime: timeSlot.startTime,
                            endTime: timeSlot.endTime,
                            bracketId: 0,
                        })
                );

                return new Bracket({
                    id: 0,
                    dayChoices: bracket.dayChoices,
                    maxTeamAmount: bracket.maxTeamAmount,
                    divisionId: 0,
                    teams: [],
                    timeSlots,
                });
            });

            return new Division({
                id: 0,
                name: division.name,
                type: division.type,
                level: division.level,
                maxTeamSize: division.maxTeamSize,
                minMenCount: division.minMenCount,
                minWomenCount: division.minWomenCount,
                brackets,
                leagueId: 0,
            });
        });

        return new League({
            id: 0,
            name: league.name,
            sport: league.sport,
            startDate: league.startDate,
            endDate: league.endDate,
            divisions,
            contestId,
            organizationId: "",
        });
    });

    const response = await competitionService.createLeagues(leagueList, contestId, "test1");
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200);
});

router.get("/contest/:id/leagues", check("id"), async (req, res) => {
    const { id } = req.params!;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(id)) {
        return res.status(400).json(APIResponse[400]("param id is not a number"));
    }
    // const { sub } = req.auth!.payload;

    const response = await competitionService.findLeaguesByContestId(Number(id), "test1");
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

// REVISIT - will only be one method to return names and ids of organizations
router.route("/").get(
    // checkJwt,
    async (req, res) => {
        const response = await playerService.findOrganizationList();

        if (response instanceof APIResponse) {
            return res.status(response.statusCode).json(response);
        }
        return res.status(200).json(response);
    }
);

export default router;
