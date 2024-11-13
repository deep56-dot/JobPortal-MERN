import express from "express";
import {isAuthenticated,isAuthorized} from "../middlewares/auth.js"
import { deleteAppliaction, 
         getAllEmployerApplications, 
         getAllJobSeekersApplications, 
         postApplication } from "../controllers/applicationsController.js";

const router = express.Router();

router.post(
  "/post/:id",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  postApplication
);

router.get(
  "/employer/getall",
  isAuthenticated,
  isAuthorized("Employer"),
  getAllEmployerApplications
);

router.get(
  "/jobseeker/getall",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  getAllJobSeekersApplications
);

router.delete("/delete/:id", isAuthenticated, deleteAppliaction);

export default router;