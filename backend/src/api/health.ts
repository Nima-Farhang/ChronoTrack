import express, { Request, Response } from "express";



// A function to set up the health endpoint
export default function setupHealthEndpoint(app: express.Express) {
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
  });
}