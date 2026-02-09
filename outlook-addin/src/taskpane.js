/* global Office */

// Configuration - can be overridden by environment
const GEOCODE_API_URL = window.location.protocol + '//' + window.location.host + '/geocode';

// Initialize Office add-in
Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    console.log("BoligBot Address Lookup add-in initialized");

    // Set up event handlers
    document
      .getElementById("extractButton")
      .addEventListener("click", extractFromSelection);
    document
      .getElementById("extractBodyButton")
      .addEventListener("click", extractFromBody);
    document
      .getElementById("lookupButton")
      .addEventListener("click", lookupManualAddress);
  }
});

/**
 * Extract address from selected text in email
 */
function extractFromSelection() {
  Office.context.mailbox.item.getSelectedDataAsync(
    Office.CoercionType.Text,
    (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const selectedText = result.value;
        if (selectedText && selectedText.trim()) {
          document.getElementById("addressInput").value = selectedText;
          geocodeAddress(selectedText);
        } else {
          showError("Please select some text in the email first.");
        }
      } else {
        showError("Failed to get selected text: " + result.error.message);
      }
    }
  );
}

/**
 * Extract address from email body
 */
function extractFromBody() {
  Office.context.mailbox.item.body.getAsync(
    Office.CoercionType.Text,
    (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const bodyText = result.value;
        // Simple address extraction - look for patterns
        const address = extractAddressFromText(bodyText);

        if (address) {
          document.getElementById("addressInput").value = address;
          geocodeAddress(address);
        } else {
          showError(
            "Could not automatically extract an address. Please select text or enter manually."
          );
        }
      } else {
        showError("Failed to get email body: " + result.error.message);
      }
    }
  );
}

/**
 * Simple address extraction from text
 * This is a basic implementation - can be enhanced with better regex
 */
function extractAddressFromText(text) {
  // Look for common address patterns
  // This is a simple Danish address pattern
  const patterns = [
    /\b([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+)*\s+\d+[A-Za-z]?,?\s*\d{4}\s+[A-ZÆØÅ][a-zæøå]+)\b/,
    /\b(\d+\s+[A-ZÆØÅ][a-zæøå]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z]{2}\s+\d{5})\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matches, return first line that looks like an address
  const lines = text.split("\n");
  for (const line of lines) {
    if (
      line.match(/\d/) &&
      line.length > 10 &&
      line.length < 100 &&
      !line.includes("@")
    ) {
      return line.trim();
    }
  }

  return null;
}

/**
 * Lookup manually entered address
 */
function lookupManualAddress() {
  const address = document.getElementById("addressInput").value.trim();

  if (!address) {
    showError("Please enter an address to lookup.");
    return;
  }

  geocodeAddress(address);
}

/**
 * Geocode an address using the BoligBot service
 */
async function geocodeAddress(address) {
  hideError();
  showLoading();

  try {
    const response = await fetch(
      `${GEOCODE_API_URL}?address=${encodeURIComponent(address)}`
    );

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // Response is not JSON, use default error message
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error("Geocoding error:", error);
    hideLoading();
    showError(
      "Failed to lookup address: " +
        (error.message || "Network or server error")
    );
  }
}

/**
 * Display geocoding results
 */
function displayResults(data) {
  hideLoading();

  const resultSection = document.getElementById("resultSection");
  const resultContent = document.getElementById("resultContent");

  // Build HTML for results
  let html = `
    <div class="result-item">
      <strong>Address:</strong>
      <p>${escapeHtml(data.displayName || data.query)}</p>
    </div>
  `;

  if (data.position) {
    html += `
      <div class="result-item">
        <strong>Coordinates:</strong>
        <div class="coordinates">
          Latitude: ${data.position.lat}<br>
          Longitude: ${data.position.lon}
        </div>
      </div>
    `;
  }

  if (data.address) {
    const addr = data.address;
    const addressParts = [];

    if (addr.road) addressParts.push(addr.road);
    if (addr.house_number) addressParts.push(addr.house_number);
    if (addr.postcode) addressParts.push(addr.postcode);
    if (addr.city || addr.town || addr.village)
      addressParts.push(addr.city || addr.town || addr.village);
    if (addr.country) addressParts.push(addr.country);

    if (addressParts.length > 0) {
      html += `
        <div class="result-item">
          <strong>Address Details:</strong>
          <p>${addressParts.map(escapeHtml).join(", ")}</p>
        </div>
      `;
    }
  }

  if (data.type) {
    html += `
      <div class="result-item">
        <strong>Type:</strong>
        <p>${escapeHtml(data.type)}</p>
      </div>
    `;
  }

  resultContent.innerHTML = html;
  resultSection.style.display = "block";
}

/**
 * Show loading spinner
 */
function showLoading() {
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("resultContent").innerHTML = "";
}

/**
 * Hide loading spinner
 */
function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}

/**
 * Show error message
 */
function showError(message) {
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("errorSection").style.display = "block";
}

/**
 * Hide error message
 */
function hideError() {
  document.getElementById("errorSection").style.display = "none";
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
