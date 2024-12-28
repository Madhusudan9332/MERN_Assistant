// import express, { urlencoded } from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import bodyParser from "body-parser";

// import aiRoute from "./route/ai";
// import path from "path";
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const path = require("path");

const mode = process.env.NODE_ENV || 'development';

const aiRoute = require("./route/ai");

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();

const _dirname = path.resolve();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: mode== "development" ? `http://localhost:${PORT}` : "https://mern-assistant.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

// api's route
app.use("/ai", aiRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
});
