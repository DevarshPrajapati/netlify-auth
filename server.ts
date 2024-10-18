import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connect from "./config/db";
import auth from "./src/routes/authRouter";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
connect();

app.get("/", (req: Request, res: Response) => {
  res.send("Node js server is running.");
});

app.use('/user', auth)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
