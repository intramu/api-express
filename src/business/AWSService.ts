import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
require("dotenv").config();

/** AWS Service for uploading profile pictures */

/** S3 Client used to specifically interact with S3 bucket*/
const s3 = new S3Client({
    region: "us-west-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? "",
    },
});

/**
 * Multer acts as middleware for express and uploads the image to S3 before running
 * the endpoint's code. It will then return the location name to save in the
 * database
 */
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "intramu-images",
        // acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.originalname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});
