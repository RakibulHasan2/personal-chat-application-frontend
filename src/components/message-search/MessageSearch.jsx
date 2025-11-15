import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './MessageSearch.css';

const MessageSearch = ({ onSearchResults, onClearSearch }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            handleClearSearch();
            return;
        }

        if (searchQuery.trim().length < 2) {
            return; // Don't search for less than 2 characters
        }

        setIsSearching(true);
        try {
            const response = await apiService.searchMessages(searchQuery.trim());

            if (response.success) {
                onSearchResults(response.data, searchQuery.trim());
            } else {
                onSearchResults([], searchQuery.trim());
            }
        } catch (error) {
            console.error('Search failed:', error);
            onSearchResults([], searchQuery.trim());
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setQuery('');
        onClearSearch?.();
    };

    useEffect(() => {
        if (!query.trim()) {
            handleClearSearch();
            return;
        }

        const timeoutId = setTimeout(() => {
            if (query.trim().length >= 2) {
                handleSearch({ preventDefault: () => { } });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="message-search">
            <div className="search-form">
                <div className="search-input-group">
                    <div className="search-input-container">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="search-input"
                            disabled={isSearching}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="clear-search-btn"
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {isSearching && (
                        <div className="search-status">
                            <span className="search-spinner">⏳</span>
                            <span>Searching...</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessageSearch;