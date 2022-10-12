import express from "express";
import {
    createPoolAddress,
    getAllPoolAddresses,
    getParticularPoolAddress,
    getPoolAddressByIdNumber
} from "../controllers/poolAddresses.js"

const PoolAddressRouter = express.Router();

PoolAddressRouter.route('/')
    .get(getAllPoolAddresses)
    .post(createPoolAddress);
PoolAddressRouter.route('/addresses').post(getPoolAddressByIdNumber)
PoolAddressRouter.route('/:address').get(getParticularPoolAddress)


export default PoolAddressRouter;
