// microservice1.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post("/processData", (req, res) => {
  const { data } = req.body;
  console.log(`Microservice 1 received data: ${data}`);

  // Simulate processing and return a response
  res.json({ result: `Processed by Microservice 1: ${data}` });
});

app.listen(port, () => {
  console.log(`Microservice 1 is running on http://localhost:${port}`);
});
