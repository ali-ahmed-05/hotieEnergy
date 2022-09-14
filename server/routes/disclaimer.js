import express from "express";
import {getDisclaimers, createDisclaimers} from "../controllers/disclaimer.js";

const disclaimerRouter = express.Router();


disclaimerRouter.route('/disclaimer')
    .get(getDisclaimers)
    .post(createDisclaimers)

export default disclaimerRouter