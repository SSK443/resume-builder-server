import express from 'express';
import {
  createResume,
  deleteResume,
  getResumeById,
  getPublicResumeById,
  updateResume,
} from "../controller/resumeController.js";
import protect from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const resumeRouter = express.Router();

// Create resume - POST /api/resumes/create
resumeRouter.post("/create", protect, createResume);


resumeRouter.put(
  "/update/:resumeId",
  upload.single("image"),
  protect,
  updateResume
);

// Delete resume - DELETE /api/resumes/delete/:resumeId
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);

// Get resume by ID - GET /api/resumes/get/:resumeId
resumeRouter.get("/get/:resumeId", protect, getResumeById );

// Get public resume - GET /api/resumes/public/:resumeId
resumeRouter.get("/public/:resumeId", getPublicResumeById);




export default resumeRouter;

