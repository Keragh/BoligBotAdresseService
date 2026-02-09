# BoligBot Outlook Add-in

A modern Office.js-based Outlook add-in that integrates with the BoligBot geocoding service to extract and lookup addresses directly from emails.

## Features

- **Extract from Selection**: Select any text in an email and extract it as an address
- **Auto-extract from Body**: Automatically detect and extract addresses from email body
- **Manual Entry**: Manually enter any address for lookup
- **Real-time Geocoding**: Get latitude, longitude, and detailed address information
- **Modern UI**: Clean, responsive interface with purple gradient theme

## Architecture

This is a modern Outlook add-in built using:
- **Office.js API**: Modern JavaScript API for Office applications
- **Manifest XML**: Standard Office Add-in manifest format
- **Task Pane**: Side panel interface for user interaction
- **HTTPS**: Required for production use

## File Structure

```
outlook-addin/
├── manifest.xml           # Add-in manifest (Office configuration)
├── src/
│   ├── taskpane.html     # Main UI
│   ├── taskpane.js       # JavaScript logic
│   └── taskpane.css      # Styling
└── assets/
    ├── icon-16.png       # 16x16 icon
    ├── icon-32.png       # 32x32 icon
    ├── icon-64.png       # 64x64 icon
    └── icon-80.png       # 80x80 icon
```

## Prerequisites

- Node.js and npm installed
- HTTPS server (configured in main server.js)
- Valid SSL certificate (in /ssl directory)
- Outlook desktop, web, or mobile client

## Installation & Development

### 1. Start the HTTPS Server

The add-in requires HTTPS. Start the server:

```bash
npm install
npm start
```

The server will run on https://localhost:3001

### 2. Sideload the Add-in

#### For Outlook on Desktop (Windows/Mac):

1. Open Outlook
2. Create or open any email
3. Click on "Get Add-ins" or "Add-ins" in the ribbon
4. Select "My add-ins" from the left menu
5. Choose "Add a custom add-in" → "Add from file"
6. Browse to and select `outlook-addin/manifest.xml`
7. Click "Install" and accept the warning

#### For Outlook on the Web:

1. Go to https://outlook.office.com
2. Open any email
3. Click the "..." menu → "Get Add-ins"
4. Click "My add-ins" → "Add a custom add-in" → "Add from URL"
5. Enter the URL to your manifest.xml file
6. Click "Install"

### 3. Use the Add-in

1. Open any email in Outlook
2. Look for "BoligBot" button in the ribbon or "Address Lookup" in the add-ins menu
3. Click to open the task pane
4. Select text containing an address or enter one manually
5. Click "Extract Address" or "Lookup Address"
6. View the geocoded results

## API Integration

The add-in connects to the BoligBot geocoding service at:

```
GET https://localhost:3001/geocode?address={address}
```

Response format:
```json
{
  "query": "Hovedgaden 1, 1000 København",
  "displayName": "Hovedgaden 1, København, Danmark",
  "position": {
    "lat": 55.6761,
    "lon": 12.5683
  },
  "address": {
    "road": "Hovedgaden",
    "house_number": "1",
    "postcode": "1000",
    "city": "København",
    "country": "Danmark"
  }
}
```

## Customization

### Change API Endpoint

Edit `src/taskpane.js` and modify:

```javascript
const GEOCODE_API_URL = "https://your-domain.com/geocode";
```

### Update Branding

1. Replace icon files in `assets/` with your own
2. Update colors in `src/taskpane.css`:
   - Primary gradient: `#667eea` to `#764ba2`
   - Accent color: `#667eea`

### Modify Manifest

Edit `manifest.xml` to change:
- `<Id>`: Generate a unique GUID
- `<DisplayName>`: Your add-in name
- `<Description>`: Your description
- URLs: Update all localhost URLs to your domain

## Production Deployment

### 1. Update Manifest URLs

Replace all `localhost:3001` URLs in `manifest.xml` with your production domain:

```xml
<SourceLocation DefaultValue="https://your-domain.com/outlook-addin/src/taskpane.html"/>
```

### 2. Deploy to Server

1. Copy the entire `outlook-addin` directory to your web server
2. Ensure HTTPS is properly configured with valid SSL certificate
3. Test that all files are accessible via HTTPS

### 3. Publish to AppSource (Optional)

To make your add-in available in the Office Store:

1. Create a Partner Center account
2. Prepare screenshots and marketing materials
3. Submit your manifest for validation
4. Follow Microsoft's certification process

## Troubleshooting

### Add-in doesn't load

- Ensure HTTPS server is running
- Check that SSL certificate is valid
- Verify manifest.xml URLs are correct
- Clear Office cache: Delete `%LocalAppData%\Microsoft\Office\16.0\Wef\` (Windows)

### CORS Errors

- Ensure the geocoding API allows requests from the add-in domain
- Add CORS headers to the server if needed

### Icons not showing

- Verify icon files exist in `assets/` directory
- Check that icon URLs in manifest.xml are correct
- Icons must be accessible via HTTPS

## Security Considerations

- Add-in only requests `ReadItem` permission (read-only access to emails)
- All API calls use HTTPS
- No email content is stored or transmitted except selected addresses
- XSS protection implemented in result display

## Browser Support

- Outlook 2016 or later (Windows/Mac)
- Outlook on the web (all modern browsers)
- Outlook mobile (iOS/Android)

## License

Same as the BoligBot Address Service project.

## Support

For issues or questions, please open an issue on GitHub:
https://github.com/Keragh/BoligBotAdresseService/issues
