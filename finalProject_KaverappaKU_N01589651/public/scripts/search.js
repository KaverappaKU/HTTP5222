document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchQuery = document.getElementById("searchInput").value;
    fetch(`/search?q=${encodeURIComponent(searchQuery)}`);
  });
