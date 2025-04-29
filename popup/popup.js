const toggleSwitch = document.getElementById("toggleExtension");
const clearBtn = document.getElementById("clearBtn");

// Load saved state
chrome.storage.sync.get(["isActive"], (data) => {
  toggleSwitch.checked = data.isActive !== false;
});

// Update state when changed
toggleSwitch.addEventListener("change", () => {
  chrome.storage.sync.set({ isActive: toggleSwitch.checked });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "toggle",
      isActive: toggleSwitch.checked
    });
  });
});

// Clear all highlights
clearBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "clear" });
  });
});