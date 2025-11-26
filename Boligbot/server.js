const https = require("https");
const fs = require("fs");
const path = require("path");

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
};

// Create HTTPS server
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("HTTPS Server is running\n");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
