document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM content loaded"); // Log to confirm the script is running

  const addItemBtn = document.getElementById('add-item-btn');
  const linksContainer = document.getElementById('links-container'); // Correctly select the container element

  if (!linksContainer) {
    console.error("linksContainer not found!"); // Debugging line
  }

  console.log("Add item button:", addItemBtn); // Debugging line

  // Function to load links from local storage
  const loadLinks = () => {
    chrome.storage.local.get(['links'], function (result) {
      const links = result.links || [];
      linksContainer.innerHTML = ''; // Clear any existing links

      if (links.length > 0) {
        links.forEach(link => {
          const linkItem = document.createElement('div');
          linkItem.className = 'link-item';
          linkItem.innerHTML = `
            <span>${link.name}</span>
            <span>${link.url}</span>
            <button onclick="copyLink('${link.url}')">Copy</button>
            <button onclick="deleteLink('${link.url}')">Delete</button>
          `;
          linksContainer.appendChild(linkItem);
        });
      } else {
        linksContainer.innerHTML = '<button id="add-item-btn">+ Add New Item</button>';
      }
    });
  };

  // Add a new link to the list
  addItemBtn.addEventListener('click', function () {
    console.log('Add New Item button clicked!');

    const name = prompt('Enter the name of the link:');
    const url = prompt('Enter the URL of the link:');
    if (name && url) {
      console.log(`Adding new link: ${name}, ${url}`);

      chrome.storage.local.get(['links'], function (result) {
        const links = result.links || [];
        links.push({ name, url });
        chrome.storage.local.set({ links }, function () {
          console.log('Link added:', { name, url });
          loadLinks(); // Reload links after adding a new one
        });
      });
    } else {
      console.log("Name or URL not provided");
    }
  });

  // Load the links when the popup is opened
  loadLinks();
});
