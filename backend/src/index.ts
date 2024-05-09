import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
    console.log("Hello");
})

app.listen(8000, () => {
    console.log("Server on port 8000 fcberhyjkvf");
})