const https = require("https");
const querystring = require("querystring");
const address =
  process.argv.slice(2).join(" ");
const params = querystring.stringify({ address });
const port = process.env.PORT || 3000;

const options = {
  hostname: "localhost",
  port: port,
  path: `/geocode?${params}`,
  method: "GET",
  rejectUnauthorized: false,
};

console.log(`Requesting: https://localhost:${port}/geocode?${params}`);

const req = https.request(options, (res) => {
  let data = "";

  console.log(`Status: ${res.statusCode}`);

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (err) {
      console.error("Failed to parse JSON:", err.message);
      console.log("Raw response:");
      console.log(data);
    }
  });
});

req.on("error", (e) => {
  console.error(`Request error: ${e.message}`);
});

// timeout
req.setTimeout(8000, () => {
  console.error("Request timed out after 8 seconds");
  req.destroy();
});

req.end();


// To test:
// Both in boligbot/boligbot
// terminal 1. npm install, npm start
// terminal 2. node geocode_test.js "address, city, country"

// You can technically search for just the address, but if multiple exist (different cities), it just pick the first one. So city makes it more specific.
// you can also address + postal code. Basically, you can just put any identifying info, just like in google maps.

// website: Openstreetmap.org