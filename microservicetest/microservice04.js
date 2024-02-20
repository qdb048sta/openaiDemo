// microservice4.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3004;

app.use(bodyParser.json());

app.post("/sendData", (req, res) => {
  console.log(req.body);
  const { data } = req.body;
  console.log(`Microservice 4 received data: ${data}`);

  // Simulate sending data and return a response
  res.json({ result: `Sent by Microservice 4: ${data}` + abcs });
});

app.listen(port, () => {
  console.log(`Microservice 4 is running on http://localhost:${port}`);
});
