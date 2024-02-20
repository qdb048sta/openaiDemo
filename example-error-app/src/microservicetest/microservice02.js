// microservice2.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3002;

app.use(bodyParser.json());

app.post("/transformData", (req, res) => {
  const { data } = req.body;
  console.log(`Microservice 2 received data: ${data}`);

  // Simulate data transformation and return a response
  res.json({ result: `Transformed by Microservice 2: ${data}` });
});

app.listen(port, () => {
  console.log(`Microservice 2 is running on http://localhost:${port}`);
});
