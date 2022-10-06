import express from "express";
import adminDAO from "../../data/adminDAO";
import { Organization } from "../../models/Organization";

const router = express.Router();

const adminService = new adminDAO();

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
router.get("/admins", (req, res) => {});

export default router;
