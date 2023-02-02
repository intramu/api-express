import express from "express";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import { check, param } from "express-validator";
import { OrganizationBusinessService } from "../../business/OrganizationBusinessService";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Bracket } from "../../models/competition/Bracket";
import { Division } from "../../models/competition/Division";
import { League } from "../../models/competition/League";
import { TimeSlot } from "../../models/competition/TimeSlot";
import { BracketNewInterface } from "../../interfaces/Bracket";
import { DivisionNewInterface } from "../../interfaces/Division";
import { LeagueNewInterface } from "../../interfaces/League";
import { TimeSlotInterface } from "../../interfaces/TimeSlot";
import {
    newContestSchema,
    newLeagueSchema,
    newOrganizationSchema,
    validate,
} from "../../utilities/validationSchemas";

import { Organization } from "../../models/Organization";
import { Admin } from "../../models/Admin";
import { Contest } from "../../models/competition/Contest";

const router = express.Router();

const organizationService = new OrganizationBusinessService();
const playerService = new PlayerBusinessService();

const adminScoped = requiredScopes("all: organization");
const sudoScoped = requiredScopes("all: application");

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
    const response = await organizationService.createContest(contest, "test1");

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

    const response = await organizationService.createLeagues(leagueList, contestId, "test1");
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

    const response = await organizationService.findLeaguesByContestId(Number(id), "test1");
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

// sudo scoped
router
    .route("/")
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
    .get(
        // checkJwt,
        async (req, res) => {
            const response = await playerService.findOrganizationList();

            if (response instanceof APIResponse) {
                return res.status(response.statusCode).json(response);
            }
            return res.status(200).json(response);
        }
    )
    .patch(
        // do some type of schema check for patching the organization
        async (req, res) => {
            res.status(501).json(APIResponse[501]());
        }
    );

router.get("/id/:id", async (req, res) => {
    res.status(501).json(APIResponse[501]());
});

export default router;
