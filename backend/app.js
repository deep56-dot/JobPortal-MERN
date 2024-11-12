import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";



const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
  })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/user.route.js"
import jobRoutes from "./routes/job.route.js"

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/job",jobRoutes);

connection();


export default app;
