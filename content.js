let isExtensionActive = true;
const colors = ["#FFEB3B", "#FF4081", "#00BCD4", "#4CAF50", "#9C27B0"];

// Create the color menu
function createColorMenu(x, y) {
  const menu = document.createElement('div');
  menu.className = 'smart-marker-menu';
  menu.style.left = `${x}px`;
  menu.style.top = `${y - 40}px`;

  colors.forEach(color => {
    const colorBtn = document.createElement('div');
    colorBtn.className = 'smart-marker-color-option';
    colorBtn.style.backgroundColor = color;
    colorBtn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevents losing selection
    });
    colorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      highlightSelection(color);
      document.body.removeChild(menu);
    });
    menu.appendChild(colorBtn);
  });

  document.body.appendChild(menu);

  // Close menu when clicking outside
  setTimeout(() => {
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    document.addEventListener('click', closeMenu);
  }, 10);
}

// Highlight text
function highlightSelection(color) {
  try {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'smart-marker-highlight';
    span.style.backgroundColor = color;
    span.style.borderRadius = '2px';
    span.style.padding = '0 2px';

    // Save the range content
    const content = range.cloneContents();
    span.appendChild(content);
    range.deleteContents();
    range.insertNode(span);

    // Clear selection
    selection.removeAllRanges();
  } catch (error) {
    console.error('Error during highlighting:', error);
  }
}

// Show menu on mouse release
document.addEventListener("mouseup", (e) => {
  if (!isExtensionActive) return;
  const selection = window.getSelection();
  if (selection.toString().trim() !== "") {
    createColorMenu(e.pageX, e.pageY);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle") isExtensionActive = request.isActive;
  else if (request.action === "clear") {
    document.querySelectorAll(".smart-marker-highlight").forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        const textContent = el.textContent;
        parent.replaceChild(document.createTextNode(textContent), el);
      }
    });
  }
});