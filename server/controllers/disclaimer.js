import asyncHandler from "express-async-handler";
import Disclaimer from "../models/disclaimer.js";

//@desc     Create new Disclaimer
//@route    POST /api/disclaimer
//@access   Public
const createDisclaimers = asyncHandler(async (req, res) => {
    try {
        const createdDisclaimer = await new Disclaimer(req.body).save();

        if (createdDisclaimer) {
            return res.status(200).send({status: true, message: 'Disclaimer is created successfully'});
        }
        return res.status(400).send({status: false, message: 'Some error occurred while creating Disclaimer'});
    } catch (e) {
        res.status(400).send({status: false, errors: e.message})
        console.log(`Error occurred while creating disclaimer`, e);
    }
})


//@desc     GET All Disclaimer
//@route    GET /api/disclaimer
//@access   Public
const getDisclaimers = asyncHandler(async (req, res) => {
    const disclaimers = await Disclaimer.find({});

    if (disclaimers.length === 0) {
        return res.status(200).send({status: true, disclaimers, message: 'NO Disclaimers exist in DB'})
    }

    res.status(200).send({status: true, disclaimers, message: 'Disclaimers Fetched Successfully'})
});

export {getDisclaimers, createDisclaimers}