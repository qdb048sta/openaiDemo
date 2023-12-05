import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 8443;
import { openaiResponse } from "../backend/openaitest.js";
import { langChainResponse } from "../backend/langChainRead.js";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/openai", bodyParser.json(), openaiResponse);
app.post("/langChain", bodyParser.json(), langChainResponse);
app.post("/test", (req, res) => {
  console.log("connection is correct");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
