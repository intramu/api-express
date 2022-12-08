import express from "express";
import AdminDAO from "../../data/adminDAO";
import { Organization } from "../../models/Organization";

const router = express.Router();

const adminService = new AdminDAO();

router.post("/organization", (req, res) => {
    const { body } = req;

    const org = new Organization(
        body.id,
        body.name,
        body.image,
        body.info,
        body.mainColor,
        body.approvalStatus,
        body.dateCreated
    );
    adminService.createOrganization(org);

    res.status(200).json("Executed");
});

// check admins organization id to show correct admin list
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/admins", (req, res) => {
    throw new Error("Unimplemented function");
});

export default router;
