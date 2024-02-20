// microservice3.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3003;

app.use(bodyParser.json());

app.post("/validateData", (req, res) => {
  const { data } = req.body;
  console.log(`Microservice 3 received data: ${data}`);

  // Simulate data validation and return a response
  res.json({ result: `Validated by Microservice 3: ${data}` });
});

app.listen(port, () => {
  console.log(`Microservice 3 is running on http://localhost:${port}`);
});
