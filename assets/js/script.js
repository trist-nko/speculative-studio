// This code will run when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on the catalog page
  const catalogBody = document.getElementById('catalog-body');
  if (catalogBody) {
    fetch('../assets/catalog.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const row = document.createElement('tr');
          
          // Assuming item.name would be derived from item.id if not present
          // For now, let's use the item.id as name if item.name is not in JSON
          const itemName = item.name || item.id.split('.')[0].replace(/[-_]/g, ' ');

          row.innerHTML = `
            <td><img src="../assets/images/catalog-img/${item.id}" alt="${itemName}"></td>
            <td>${itemName}</td>
            <td class="desc">${item.description}</td>
          `;
          
          catalogBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error loading the catalog:', error);
      });
  }
});
