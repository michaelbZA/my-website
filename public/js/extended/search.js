document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');
    const searchResultsCount = document.getElementById('search-results-count');
    const searchResultsEmpty = document.getElementById('search-results-empty');
    const searchResultsLoading = document.getElementById('search-results-loading');

    let fuse;
    let searchIndex;

    // Load the search index
    fetch('/searchindex.json')
        .then(response => response.json())
        .then(data => {
            searchIndex = data;
            fuse = new Fuse(searchIndex, {
                keys: ['title', 'permalink', 'summary', 'content'],
                isCaseSensitive: false,
                shouldSort: true,
                location: 0,
                distance: 1000,
                threshold: 0.4,
                minMatchCharLength: 0
            });
        });

    // Handle search input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.style.display = 'block';
        searchResultsLoading.style.display = 'block';
        searchResultsList.innerHTML = '';
        searchResultsCount.style.display = 'none';
        searchResultsEmpty.style.display = 'none';

        // Perform search
        const results = fuse.search(query);
        
        searchResultsLoading.style.display = 'none';
        
        if (results.length === 0) {
            searchResultsEmpty.style.display = 'block';
            return;
        }

        searchResultsCount.style.display = 'block';
        searchResultsCount.textContent = `Found ${results.length} results`;

        // Display results
        results.forEach(result => {
            const item = result.item;
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${item.permalink}">
                    <h3>${item.title}</h3>
                    ${item.summary ? `<p>${item.summary}</p>` : ''}
                </a>
            `;
            searchResultsList.appendChild(li);
        });
    });

    // Handle search form submission
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
    });
}); 