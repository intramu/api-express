import express from "express";
import { CompetitionBusinessService } from "../../../business/service/CompetitionBusinessService";
import { handleErrorResponse } from "../../../utilities/apiFunctions";
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
    .post(organizationIdParam, async (req, res) => {
        const { orgId } = req.params;
        // get body for contest
        const response = true;
        return handleErrorResponse(response, res);
    });

router
    .route("/contests/:compId")
    .get(compIdParam, async (req, res) => {
        const { compId } = req.params;
    })
    .patch()
    .delete();

router.route("/contests/:compId/leagues").get().post();
router.route("/leagues/:compId").get().delete();
