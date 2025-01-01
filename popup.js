document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM content loaded");

  const linksContainer = document.getElementById('links-container');

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
            <span class="link-name">${link.name}</span>
            <span class="link-url">${link.url}</span>
            <button class="copy-btn" data-url="${link.url}">Copy</button>
            <button class="delete-btn" data-url="${link.url}">Delete</button>
          `;
          linksContainer.appendChild(linkItem);
        });
        

        // Add event listeners for Copy and Delete buttons after rendering the links
        const copyButtons = document.querySelectorAll('.copy-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        copyButtons.forEach(button => {
          button.addEventListener('click', function () {
            const url = button.getAttribute('data-url');
            copyLink(url);
          });
        });

        deleteButtons.forEach(button => {
          button.addEventListener('click', function () {
            const url = button.getAttribute('data-url');
            deleteLink(url);
          });
        });
      } else {
        // Add placeholder message when no links exist
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-state';
        placeholder.textContent = 'Add new links to display here';
        linksContainer.appendChild(placeholder);
      }

      // Ensure the "Add New Item" button exists
      let addItemBtn = document.getElementById('add-item-btn');
      if (!addItemBtn) {
        addItemBtn = document.createElement('button');
        addItemBtn.id = 'add-item-btn';
        addItemBtn.textContent = '+ Add New Item';
        linksContainer.appendChild(addItemBtn);
      }

      // Attach a single event listener to the "Add New Item" button
      addItemBtn.onclick = () => {
        const name = prompt('Enter the name of the link:');
        if (!name) {
          console.log("Link name not provided. Exiting.");
          return; // Exit if no name is provided
        }

        const url = prompt('Enter the URL of the link:');
        if (!url) {
          console.log("URL not provided. Link addition canceled.");
          return; // Exit if no URL is provided
        }

        // Save the new link
        chrome.storage.local.get(['links'], function (result) {
          const links = result.links || [];
          links.push({ name, url });
          chrome.storage.local.set({ links }, function () {
            console.log("Link added successfully:", { name, url });
            loadLinks(); // Reload links after adding a new one
          });
        });
      };
    });
  };

  // Function to copy the link to the clipboard
  const copyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      console.log(`Link copied: ${url}`);
      alert(`Link copied: ${url}`);
    }).catch((error) => {
      console.error('Error copying text: ', error);
    });
  };

  // Function to delete the link from local storage
  const deleteLink = (url) => {
    chrome.storage.local.get(['links'], function (result) {
      let links = result.links || [];
      links = links.filter(link => link.url !== url); // Remove the link that matches the URL

      chrome.storage.local.set({ links }, function () {
        console.log(`Link deleted: ${url}`);
        loadLinks(); // Reload links after deleting
      });
    });
  };

  // Load the links when the popup is opened
  loadLinks();
});
