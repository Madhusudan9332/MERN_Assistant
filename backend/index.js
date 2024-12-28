import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import aiRoute from "./route/ai"; 
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();

const _dirname = path.resolve();


// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:"https://mern-assistant.onrender.com",
    credentials:true
}
app.use(cors(corsOptions));

// api's route
app.use("/ai", aiRoute );

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_,res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
