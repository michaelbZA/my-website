document.addEventListener('DOMContentLoaded', function() {
    const searchInput          = document.getElementById('search-input');
    const searchResults        = document.getElementById('search-results');
    const searchResultsList    = document.getElementById('search-results-list');
    const searchResultsCount   = document.getElementById('search-results-count');
    const searchResultsEmpty   = document.getElementById('search-results-empty');
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
                    { name: 'title',   weight: 2   },
                    { name: 'summary', weight: 1.5 },
                    { name: 'content', weight: 1   }
                ],
                isCaseSensitive: false,
                shouldSort: true,
                location: 0,
                distance: 100,
                threshold: 0.2,
                minMatchCharLength: 3,
                ignoreLocation: false,
                tokenize: true,
                matchAllTokens: true,
                useExtendedSearch: false
            });
        });

    // Handle search input
    searchInput.addEventListener('input', function(e) {
        const queryRaw = e.target.value.trim();
        const query    = queryRaw.toLowerCase();

        // Hide results immediately if query is too short
        if (query.length < 3) {
            searchResults.style.display         = 'none';
            searchResultsList.innerHTML         = '';
            searchResultsCount.style.display    = 'none';
            searchResultsEmpty.style.display    = 'none';
            searchResultsLoading.style.display  = 'none';
            return;
        }

        // Show loader
        searchResults.style.display        = 'block';
        searchResultsLoading.style.display = 'block';
        searchResultsList.innerHTML        = '';
        searchResultsCount.style.display   = 'none';
        searchResultsEmpty.style.display   = 'none';

        // Perform fuzzy search across all fields
        let fuseResults = fuse.search(queryRaw);

        // Deduplicate by permalink
        const seen = new Set();
        const uniqueResults = [];
        fuseResults.forEach(r => {
            const permalink = r.item.permalink;
            if (!seen.has(permalink)) {
                seen.add(permalink);
                uniqueResults.push(r);
            }
        });

        // Optional: only keep true substring matches
        const filtered = uniqueResults
            .filter(r => {
                const item = r.item;
                return (
                    item.title.toLowerCase().includes(query)   ||
                    item.summary.toLowerCase().includes(query) ||
                    item.content.toLowerCase().includes(query)
                );
            });

        searchResultsLoading.style.display = 'none';

        if (filtered.length === 0) {
            searchResultsEmpty.style.display = 'block';
            return;
        }

        // Display count
        searchResultsCount.style.display = 'block';
        searchResultsCount.textContent   = `Found ${filtered.length} result${filtered.length > 1 ? 's' : ''}`;

        // Render results
        filtered.forEach(r => {
            const item = r.item;
            const li   = document.createElement('li');
            li.innerHTML = `
                <a href="${item.permalink}">
                    <h3>${item.title}</h3>
                    ${item.summary ? `<p>${item.summary}</p>` : ''}
                </a>
            `;
            searchResultsList.appendChild(li);
        });
    });

    // Prevent actual form submission
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
    });
});