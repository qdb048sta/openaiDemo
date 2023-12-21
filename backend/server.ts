import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { openaiResponse } from "./openaitest";
import langChainInitializer from "./langChainInitializer";
import { getAllConversation, langChainResponse } from "./langChainRead";

const app: Express = express();
const port = 8443;

const startServer = async () => {
  await langChainInitializer.init();

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  app.post("/openai", bodyParser.json(), openaiResponse);
  app.post("/langChain", bodyParser.json(), langChainResponse);
  app.get("/langChain", getAllConversation);

  app.post("/test", (req: Request, res: Response) => {
    console.log("connection is correct");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
