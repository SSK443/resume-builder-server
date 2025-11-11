import express from 'express';
import {test} from "../controller/testController.js"
const testRouter=express.Router();

testRouter.get("/test",test)

export default testRouter