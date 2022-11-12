import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import users from "./routes/users";
import books from "./routes/books";
import { validateToken } from "./utils/middleware";

const app = express();
app.use(express.json());
app.use(validateToken);
app.use("/users", users);
app.use("/books", books);

async function start() {
    const MODE = process.env.NODE_ENV || "prod";
    let PORT = 80;
    if (MODE == "dev") {
        dotenv.config();
        PORT = 3000;
    }
    mongoose.connect(
        process.env.MONGO_URL!,
        {
            dbName: process.env.MONGO_DB,
        },
        (err) => {
            if (err) return console.log(err);
            app.listen(PORT, () => {
                console.log(`Server started at port ${PORT} in ${MODE} mode`);
            });
        }
    );
}

start();
