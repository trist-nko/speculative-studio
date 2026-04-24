// Global variable to store all catalog items once fetched from catalog.json
let allCatalogItems = [];

// Global object to manage the user's current selections for each clothing category.
// This object holds the selected item for 'top', 'bottom', 'footwear', and 'accessories'.
const userStyle = {
  tops: "",
  bottoms: "",
  footwear: "",
  accessories: "",
};

const avatarOptions = [
  {
    id: "young",
    src: "assets/avatar/avatar-young.webp",
    zones: {
      tops: { top: "18%", left: "10%", width: "80%", height: "37%" },
      bottoms: { top: "52%", left: "15%", width: "70%", height: "33%" },
      footwear: { top: "82%", left: "20%", width: "60%", height: "18%" },
      head: { top: "1%", left: "28%", width: "44%", height: "16%" },
      eyes: { top: "6%", left: "28%", width: "44%", height: "8%" },
      mouth: { top: "11%", left: "32%", width: "36%", height: "7%" },
      neck: { top: "15%", left: "25%", width: "50%", height: "8%" },
      chest: { top: "22%", left: "25%", width: "50%", height: "16%" },
      hand: { top: "50%", left: "68%", width: "28%", height: "28%" },
    },
  },
  {
    id: "mid",
    src: "assets/avatar/avatar-mid.webp",
    zones: {
      tops: { top: "18%", left: "10%", width: "80%", height: "37%" },
      bottoms: { top: "52%", left: "15%", width: "70%", height: "33%" },
      footwear: { top: "82%", left: "20%", width: "60%", height: "18%" },
      head: { top: "1%", left: "28%", width: "44%", height: "16%" },
      eyes: { top: "6%", left: "28%", width: "44%", height: "8%" },
      mouth: { top: "11%", left: "32%", width: "36%", height: "7%" },
      neck: { top: "15%", left: "25%", width: "50%", height: "8%" },
      chest: { top: "22%", left: "25%", width: "50%", height: "16%" },
      hand: { top: "50%", left: "68%", width: "28%", height: "28%" },
    },
  },
  {
    id: "old",
    src: "assets/avatar/avatar-old.webp",
    zones: {
      tops: { top: "18%", left: "10%", width: "80%", height: "37%" },
      bottoms: { top: "52%", left: "15%", width: "70%", height: "33%" },
      footwear: { top: "82%", left: "20%", width: "60%", height: "18%" },
      head: { top: "1%", left: "28%", width: "44%", height: "16%" },
      eyes: { top: "6%", left: "28%", width: "44%", height: "8%" },
      mouth: { top: "11%", left: "32%", width: "36%", height: "7%" },
      neck: { top: "15%", left: "25%", width: "50%", height: "8%" },
      chest: { top: "22%", left: "25%", width: "50%", height: "16%" },
      hand: { top: "50%", left: "68%", width: "28%", height: "28%" },
    },
  },
];

const itemOverrides = {
  "2.webp": { top: "20.5%", left: "10%", width: "80%", height: "30%" },
  "3.webp": { top: "0%", left: "12%", width: "75%", height: "95%" },
  "Camisole (SC30).webp": {
    top: "14%",
    left: "10%",
    width: "80%",
    height: "38%",
  },
  "cardigan.webp": {
    position: "absolute",
    top: "-35%",
    left: "8%",
    width: "90%",
    height: "170%",
  },
  "DRIES_JACKET.webp": {
    position: "absolute",
    top: "29%",
    left: "22%",
    width: "50%",
    height: "30%",
  },
};

let activeAvatar = null;

const loadRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  activeAvatar = avatarOptions[randomIndex];

  const avatarImg = document.getElementById("avatar");
  avatarImg.src = activeAvatar.src;
};

const styleHistory = [];

/**
 * Updates the visual display in the 'avatar-box' based on the items selected in `userStyle`.
 * It clears previous selections and then adds images for each chosen item, layering them.
 * Includes basic error handling for missing avatar box element and image loading.
 */
const updateAvatarBox = () => {
  const avatarBox = document.querySelector(".avatar-box");
  const clothingLayers = document.getElementById("clothing-layers");

  if (!avatarBox) {
    console.error("Avatar box element not found.");
    return;
  }
  if (!clothingLayers) {
    console.error("Clothing layers element not found.");
    return;
  }
  clothingLayers.innerHTML = ""; // Clear any previously displayed items

  // Iterate over each category in the userStyle object
  for (const category in userStyle) {
    const item = userStyle[category];
    // If an item is selected for the current category, display it
    if (item) {
      // Create a clean name from the item's ID for alt text
      const itemName = item.id.split(".")[0].replace(/[-_]/g, " ");

      const imgElement = document.createElement("img");
      imgElement.src = `assets/images/catalog-img/${item.id}`; // Set image source
      imgElement.alt = `Selected ${itemName}`; // Set alt text for accessibility

      const zoneKey =
        item.category === "accessories" && item.location
          ? item.location
          : item.category;

      const zone = itemOverrides[item.id] || activeAvatar.zones[zoneKey];

      if (zone) {
        imgElement.style.position = "absolute";
        imgElement.style.top = zone.top;
        imgElement.style.left = zone.left;
        imgElement.style.width = zone.width;
        imgElement.style.height = zone.height;
        imgElement.style.objectFit = "contain";
      } else {
        // Fallback: if a zone key is somehow missing, center the image
        imgElement.style.position = "absolute";
        imgElement.style.top = "10%";
        imgElement.style.left = "10%";
        imgElement.style.width = "80%";
        imgElement.style.height = "80%";
        imgElement.style.objectFit = "contain";
        console.warn(`No zone found for key: "${zoneKey}"`);
      }

      // Error handling for images that fail to load
      imgElement.onerror = function () {
        this.onerror = null; // Prevent infinite loop if fallback also fails
        this.src = ""; // Clear broken image source
        this.alt = "Image Not Found"; // Display alt text instead
        this.style.width = "50px"; // Adjust size for fallback text
        this.style.height = "50px";
        this.style.border = "1px solid red"; // Visual cue for broken image
      };
      clothingLayers.appendChild(imgElement);
    }
  }
};

/**
 * Handles the selection of a clothing item from a dropdown menu.
 * Updates the `userStyle` object with the selected item and refreshes the avatar display.
 * Also closes all dropdowns after an item is selected for a cleaner UI.
 * @param {object} item - The selected clothing item object from catalog.json.
 */
const selectItem = (item) => {
  if (item && item.category) {
    styleHistory.push({ ...userStyle });
    userStyle[item.category] = item; // Update the userStyle object with the new item
    updateAvatarBox(); // Refresh the avatar display to show the newly selected item
    // Close all open dropdown menus to maintain a clean interface
    updateSpeculateButton();
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((menu) => menu.classList.remove("show"));
  }
};

const undoLastChange = () => {
  if (styleHistory.length === 0) {
    return;
  }
  const lastStyle = styleHistory.pop();
  Object.assign(userStyle, lastStyle);
  updateAvatarBox();
  updateSpeculateButton();
};

const countSelectedItems = () => {
  return Object.values(userStyle).filter((item) => item !== "").length;
};

const updateSpeculateButton = () => {
  const btn = document.getElementById("speculate-btn");
  if (!btn) return;
  btn.disabled = countSelectedItems() < 3;
};

const generateSpeculations = async () => {
  const btn = document.getElementById("speculate-btn");
  const output = document.querySelector(".vignette-text");

  const descriptions = Object.values(userStyle)
    .filter((item) => item !== "")
    .map((item) => item.description);

  btn.textContent = "> GENERATING...";
  btn.disabled = true;
  output.textContent = "...";

  try {
    const response = await fetch("/api/speculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptions }),
    });

    const data = await response.json();
    output.textContent = data.result || "Something went wrong. Try again.";
  } catch (error) {
    console.error("Server error:", error);
    output.textContent =
      "Could not generate speculations. Check your connection.";
  } finally {
    btn.textContent = "> GENERATE SPECULATIONS";
    btn.disabled = countSelectedItems() < 3;
  }
};

/**
 * Toggles the visibility of a specific dropdown menu.
 * When a category button is clicked, this function shows its corresponding dropdown
 * and ensures that all other dropdowns are closed, so only one is open at a time.
 * It also triggers lazy loading for images within the opened dropdown.
 * @param {Event} event - The click event from the category button.
 */
const toggleDropdown = (event) => {
  const button = event.currentTarget; // The button that was clicked
  // Extract the category name from the button's ID (e.g., 'toggle-tops' -> 'tops')
  const category = button.id.replace("toggle-", "");
  const menu = document.getElementById(`menu-${category}`); // Get the corresponding dropdown menu element

  if (!menu) {
    console.error(`Dropdown menu for category ${category} not found.`);
    return;
  }

  // Close all other dropdowns to ensure only one is open at a time
  document.querySelectorAll(".dropdown-menu").forEach((otherMenu) => {
    if (otherMenu !== menu) {
      // Don't close the current menu if it's already open
      otherMenu.classList.remove("show");
    }
  });

  // Toggle the 'show' class for the clicked dropdown menu to open or close it
  menu.classList.toggle("show");

  // If the menu is now shown, load its images
  if (menu.classList.contains("show")) {
    menu.querySelectorAll("img[data-src]").forEach((img) => {
      // Only load if the src is still the placeholder or empty
      if (
        img.src ===
          "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" ||
        img.src === ""
      ) {
        img.src = img.dataset.src; // Set the actual image source from data-src
      }
    });
  }
};

/**
 * Renders the items for a specific category into its designated dropdown menu.
 * It clears any existing items and populates the menu with new dropdown items,
 * each featuring a thumbnail image and the item's name.
 * @param {string} category - The category name (e.g., 'tops', 'bottoms').
 * @param {Array<object>} items - An array of clothing item objects for the given category.
 */
const renderDropdown = (category, items) => {
  const menuElement = document.getElementById(`menu-${category}`);
  if (!menuElement) {
    console.error(`Dropdown menu element for category ${category} not found.`);
    return;
  }
  menuElement.innerHTML = ""; // Clear existing content in the dropdown menu

  items.forEach((item) => {
    // Create a user-friendly name from the item's ID (e.g., '1.png' -> '1', 'CREEPER_BOOTS.png' -> 'CREEPER BOOTS')
    const itemName = item.id.split(".")[0].replace(/[-_]/g, " ");

    const dropdownItem = document.createElement("div");
    dropdownItem.classList.add("dropdown-item");
    // Store the full item object as a data attribute for easy retrieval on click
    dropdownItem.dataset.item = JSON.stringify(item);

    // Use template literals to construct the HTML for each dropdown item
    dropdownItem.innerHTML = `
      <img data-src="assets/images/catalog-img/${item.id}" alt="${itemName}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" onerror="this.onerror=null;this.src='';this.alt='Image Not Found';">
      <span>${itemName}</span>
    `;
    menuElement.appendChild(dropdownItem);
  });
};

// This code runs once the entire HTML document has been loaded and parsed.
document.addEventListener("DOMContentLoaded", async () => {
  // Check if we are on the catalog page (catalog.html)
  const catalogBody = document.getElementById("catalog-body");

  if (catalogBody) {
    // Logic for catalog.html
    try {
      const response = await fetch("../assets/catalog.json"); // Path adjusted for catalog.html
      const data = await response.json();

      data.forEach((item) => {
        const row = document.createElement("tr");
        const itemName =
          item.name || item.id.split(".")[0].replace(/[-_]/g, " ");

        row.innerHTML = `
          <td><img src="../assets/images/catalog-img/${item.id}" alt="${itemName}" onerror="this.onerror=null;this.src='';this.alt='Image Not Found'; this.style.width='50px'; this.style.height='50px';"></td>
          <td>${itemName}</td>
          <td class="desc">${item.description}</td>
        `;
        catalogBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error loading the catalog for catalog.html:", error);
    }
  } else {
    // Logic for index.html (avatar customization with dropdowns)
    try {
      // Fetch the catalog data from the JSON file
      const response = await fetch("assets/catalog.json");
      if (!response.ok) {
        console.error(
          "Error fetching catalog.json for index.html. Status:",
          response.status,
        );
      }
      allCatalogItems = await response.json(); // Store the fetched data globally

      /**
       * Renders all category dropdowns by filtering the global catalog items.
       */
      const renderAllDropdowns = () => {
        const categories = ["tops", "bottoms", "footwear", "accessories"];
        categories.forEach((category) => {
          // Filter items relevant to the current category
          const itemsInCategory = allCatalogItems.filter(
            (item) => item.category === category,
          );
          renderDropdown(category, itemsInCategory); // Render the dropdown for this category
        });
      };

      /**
       * Sets up all necessary event listeners for interactive elements.
       * Includes listeners for category buttons to toggle dropdowns,
       * and for dropdown items to select clothing.
       */
      const setupEventListeners = () => {
        // Attach click event listeners to all category buttons to toggle their dropdowns
        document.querySelectorAll(".category-btn").forEach((button) => {
          button.addEventListener("click", toggleDropdown);
        });

        // Attach click event listeners to each dropdown menu to handle item selection
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.addEventListener("click", (event) => {
            // Find the closest parent with the 'dropdown-item' class
            const dropdownItem = event.target.closest(".dropdown-item");
            if (dropdownItem && dropdownItem.dataset.item) {
              // Parse the stored item data and select the item
              const item = JSON.parse(dropdownItem.dataset.item);
              selectItem(item);
            }
          });
        });

        // Add a global click listener to close dropdowns when clicking outside
        document.addEventListener("click", (event) => {
          // If the click is not inside a dropdown container (button or menu)
          if (!event.target.closest(".dropdown-container")) {
            // Close all currently open dropdown menus
            document.querySelectorAll(".dropdown-menu").forEach((menu) => {
              menu.classList.remove("show");
            });
          }
        });

        document
          .getElementById("undo-btn")
          .addEventListener("click", undoLastChange);
      };

      document
        .getElementById("speculate-btn")
        .addEventListener("click", generateSpeculations);
      // Initial calls to set up the UI after data is loaded
      loadRandomAvatar();
      renderAllDropdowns(); // Populate all dropdown menus
      setupEventListeners(); // Attach all event handlers
      updateAvatarBox(); // Initialize the avatar display (e.g., with empty state)
    } catch (error) {
      console.error("Error loading the catalog for index.html:", error);
    }
  }
});
