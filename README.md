# BoligBot Address Service
Hovedopgave Datamatiker

## Description

A geocoding service that provides address lookup functionality using the OpenStreetMap Nominatim API. The service includes a modern Outlook add-in for extracting and geocoding addresses directly from emails.

## Features

- **RESTful API**: GET/POST endpoints for address geocoding
- **Outlook Add-in**: Modern Office.js-based add-in for Outlook integration
- **HTTPS Support**: Secure connections with SSL/TLS
- **MVC Architecture**: Clean separation of concerns

## Quick Start

### Installation

```bash
npm install
```

### Running the Service

```bash
npm start
```

The service will start on `https://localhost:3001`

### API Usage

```bash
# GET request
curl "https://localhost:3001/geocode?address=Hovedgaden 1, København"

# POST request
curl -X POST https://localhost:3001/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"Hovedgaden 1, København"}'
```

## Outlook Add-in

The project includes a modern Outlook add-in that allows users to:
- Extract addresses from selected email text
- Auto-detect addresses in email bodies
- Lookup addresses using the geocoding service
- View detailed location information

See [outlook-addin/README.md](outlook-addin/README.md) for installation and usage instructions.

## Project Structure

```
├── mvc/
│   ├── controller/      # Request handlers
│   ├── models/          # Data layer (Nominatim API)
│   └── routes/          # Route definitions
├── outlook-addin/       # Modern Outlook add-in
│   ├── manifest.xml     # Add-in configuration
│   ├── src/             # HTML, CSS, JS files
│   └── assets/          # Icons and images
├── ssl/                 # SSL certificates
├── server.js            # Main server file
└── package.json         # Dependencies
```

## License

ISC
