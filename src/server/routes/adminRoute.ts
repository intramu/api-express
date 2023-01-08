import express from "express";
import { body, validationResult } from "express-validator";
import { AdminBusinessService } from "../../business/AdminBusinessService";
import { Organization } from "../../models/Organization";

const router = express.Router();
const adminBS = new AdminBusinessService();

router.post("/organization", 
    body('name').isLength({min: 8}), 
    body('approvalStatus').isEmpty(), 
    (req, res) => {
        const errors = validationResult(req)
        const body = req.body;
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()})
        }

        const organization = new Organization("", body.name, body.image, body.info, body.mainColor, body.approvalStatus, null);

        adminBS.createOrganization(organization).then(result => {
            res.status(201).json(result);
        });        
});

router.get('/organizations', (req,res)=>{
    adminBS.findAllOrganizations().then(result => {
        res.status(200).json(result)
    })
})

router.get('/organization/:id', (req, res)=>{
    adminBS.findOrganizationById(req.params.id).then(result =>{
        res.status(200).json(result)
    })
})

router.delete('/organization/:id', (req,res)=>{
    adminBS.deleteOrganizationById(req.params.id).then(result => {
        res.status(200).json(result)
    })
})

router.put('/organization', 
    body('name').isLength({min: 8, max:30}),
    body('id').notEmpty(), 
    body('approvalStatus').isEmpty(),
    (req,res)=>{
        const errors = validationResult(req)
        const body = req.body
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const organization = new Organization(body.id, body.name, body.image, body.info, body.mainColor, body.approvalStatus, null);

        adminBS.updateOrganization(organization).then(result => {
            res.status(200).json(result)
        })
})



router.get("/test", (req, res) => {
    let body = req.body;

    console.log(body);
    res.status(200).json({ message: "Admin routes" });
});

router.get("/wow", (req, res) => {
    res.json({ work: "please" });
});

export default router;
