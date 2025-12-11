import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import "./api/health";

dotenv.config();

const app = express();

app.use(express.json());


// Basic error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`ChronoTrack backend listening on port ${port}`);
});
