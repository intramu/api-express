import express from "express";
import { body } from "express-validator";
import { PlayerBusinessService } from "../../business/PlayerBusinessService";
import { APIResponse } from "../../models/APIResponse";
import { Visibility } from "../../utilities/enums";
import { validate } from "../../utilities/validationSchemas";

const router = express.Router();

const playerService = new PlayerBusinessService();

/** All routes in this file will require a special authorization token to access them
 * These routes allow access to any resource.
 *
 * This is opposed to the other routes that use the passed in authorization token
 * to perform an action for that specific user
 */

router.get("/:id", async (req, res) => {
    const response = await playerService.findPlayerById(req.params.id);

    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(200).json(response);
});

router.post(
    "/",
    validate([
        body("name").notEmpty().withMessage("name is missing").trim().escape(),
        body("image").isEmpty().withMessage("image not supported"),
        body("visibility")
            .toUpperCase()
            .isIn([Visibility.OPEN, Visibility.CLOSED, Visibility.PRIVATE])
            .withMessage(
                `valid visibility options are [${Visibility.CLOSED}, ${Visibility.OPEN}, ${Visibility.PRIVATE}]`
            ),
        body("sport").notEmpty().withMessage("sport is missing").trim(),
        body("organizationId").notEmpty().withMessage("organization id is missing").trim(),
    ]),
    async (req, res) => {
        const { reqBody } = req.body;

        // const team = new Team(
        //     null,
        //     reqBody.name,
        //     null,
        //     null,
        //     null,
        //     null,
        //     body.visibility,
        //     body.sport,
        //     null,
        //     null,
        //     null,
        //     null,
        //     [],
        //     body.organizationId,
        //     null
        // );
        // const response = await playerService.createTeam(team);

        // if (response instanceof APIResponse) {
        //     return response;
        // }

        // return res.status(201).json(response);
        return res.json("Not implemented");
    }
);

export default router;
