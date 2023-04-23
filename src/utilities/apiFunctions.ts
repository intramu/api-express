import express from "express";
import { APIResponse } from "../models/APIResponse";

/**
 * Below are two methods I came up with for handling the apiResponse
 * Still need to test which one is better
 */

// router.use((req, res, next) => {
//     const { response, status } = res.locals;
//     // console.log(response);

//     if (response instanceof APIResponse) {
//         return res.status(response.statusCode).json(response);
//     }

//     return res.status(status ?? 200).json(response);
// });

// method to check if response is instance of APIResponse
export const handleErrorResponse = <Return>(
    response: APIResponse | Return,
    res: express.Response,
    statusCode?: number
) => {
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(statusCode ?? 200).json(response);
};
