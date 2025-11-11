import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume} from '../controller/aiController.js';


const aiRouter = express.Router();

//route for enhancing professional summary
//post: /api/ai/enhance-pro-sum
aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/upload-resume', protect, uploadResume);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);

export default aiRouter;