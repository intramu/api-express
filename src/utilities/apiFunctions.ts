import express from "express";
import { APIResponse } from "../models/APIResponse";

/** Below are two methods I came up with for handling the apiResponse */
// this one is a middleware but it doesn't seem like this is the proper way. It feels
// like im using middleware improperly so I'm hesitant

// router.use((req, res, next) => {
//     const { response, status } = res.locals;
//     // console.log(response);

//     if (response instanceof APIResponse) {
//         return res.status(response.statusCode).json(response);
//     }

//     return res.status(status ?? 200).json(response);
// });

// method to check if response is instance of APIResponse
export const handleErrorResponse = (response: any, res: express.Response, statusCode?: number) => {
    if (response instanceof APIResponse) {
        return res.status(response.statusCode).json(response);
    }

    return res.status(statusCode ?? 200).json(response);
};
