import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";
import { errorMiddleware } from "./middlewares/error.js";
import path from "path"

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL,"http://localhost:5173"],
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
})
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const _dirname=path.resolve()
 
import userRoutes from "./routes/user.route.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/applications.route.js"


app.use("/api/v1/user",userRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes);


app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
newsLetterCron();
connection();
app.use(errorMiddleware)


export default app;
