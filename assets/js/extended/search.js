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
                keys: [
                    { name: 'title', weight: 2 },    // Give more weight to title matches
                    { name: 'content', weight: 1 },  // Less weight to content matches
                    { name: 'summary', weight: 1.5 } // Medium weight to summary matches
                ],
                isCaseSensitive: false,
                shouldSort: true,
                location: 0,
                distance: 500,           // Reduced from 1000 to make matches more local
                threshold: 0.3,          // Reduced from 0.4 to make matching stricter
                minMatchCharLength: 3,   // Require at least 3 characters to match
                findAllMatches: false,   // Don't find all matches, just the best ones
                useExtendedSearch: true, // Enable extended search features
                ignoreLocation: false,   // Consider location in text
                tokenize: true,          // Split search terms into tokens
                matchAllTokens: true     // Require all tokens to match
            });
        });

    // Handle search input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        // Hide results immediately if query is too short
        if (query.length < 3) {
            searchResults.style.display = 'none';
            searchResultsList.innerHTML = '';
            searchResultsCount.style.display = 'none';
            searchResultsEmpty.style.display = 'none';
            searchResultsLoading.style.display = 'none';
            return;
        }

        // Only proceed with search if query is long enough
        searchResults.style.display = 'block';
        searchResultsLoading.style.display = 'block';
        searchResultsList.innerHTML = '';
        searchResultsCount.style.display = 'none';
        searchResultsEmpty.style.display = 'none';

        // Perform search with extended search syntax
        const searchPattern = {
            $or: [
                { title: query },
                { content: query },
                { summary: query }
            ]
        };
        
        const results = fuse.search(searchPattern);
        
        searchResultsLoading.style.display = 'none';
        
        if (results.length === 0) {
            searchResultsEmpty.style.display = 'block';
            return;
        }

        // Only show results with a good match score
        const goodResults = results.filter(result => result.score < 0.4);
        
        if (goodResults.length === 0) {
            searchResultsEmpty.style.display = 'block';
            return;
        }

        searchResultsCount.style.display = 'block';
        searchResultsCount.textContent = `Found ${goodResults.length} results`;

        // Display results
        goodResults.forEach(result => {
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