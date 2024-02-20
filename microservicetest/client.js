// client.js
const axios = require("axios");

// Replace with the appropriate microservice URLs
const microservice4Url = "http://localhost:3004/sendData";
const microservice3Url = "http://localhost:3003/validateData";
const microservice1Url = "http://localhost:3001/processData";
const microservice2Url = "http://localhost:3002/transformData";

// Example data to send

// microservice4.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3070;

app.use(bodyParser.json());

app.post("/totalprocess", (req, res) => {
  const { data } = req.body;
  console.log(`Microservice received data: ${data}`);

  // Simulate sending data and return a response
  // Simulate sending requests in the specified order
  axios
    .post(microservice4Url, { data })
    .then((response) => {
      console.log(response.data.result);

      return axios.post(microservice3Url, { data: response.data.result });
    })
    .then((response) => {
      console.log(response.data.result);

      return axios.post(microservice1Url, { data: response.data.result });
    })
    .then((response) => {
      console.log(response.data.result);

      return axios.post(microservice2Url, { data: response.data.result });
    })
    .then((response) => {
      console.log(response.data.result);
      res.json({ result: `total process finish: ${data}` });
    })
    .catch((error) => {
      console.error(error.message);
    });
});

app.listen(port, () => {
  console.log(`total processing on http://localhost:${port}`);
});
