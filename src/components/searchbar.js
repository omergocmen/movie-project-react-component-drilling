import React, { Component } from 'react'

export default class searchbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchHistory: [],
            loading: false,
            showAdvancedFilter: false,
            searchAnalytics: {},
        };
        this.debounceTimer = null;
        this.MIN_CHARACTERS = 2;
    }

    componentDidMount() {
        const savedHistory = localStorage.getItem('searchHistory');
        const savedAnalytics = localStorage.getItem('searchAnalytics');
        if (savedHistory) this.setState({ searchHistory: JSON.parse(savedHistory) });
        if (savedAnalytics) this.setState({ searchAnalytics: JSON.parse(savedAnalytics) });
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
    }

    handleOutsideClick = (e) => {
        if (this.searchContainer && !this.searchContainer.contains(e.target)) {
            // nothing to close now
        }
    }

    debounceSearch = (value) => {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.props.searchMovieProp({ target: { value } });
        }, 300);
    }

    handleSearchChange = (e) => {
        const value = e.target.value;
        this.setState({ searchValue: value });
        this.debounceSearch(value);
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.state.searchValue.length < this.MIN_CHARACTERS && this.state.searchValue.length > 0) {
            return;
        }
        if (this.state.searchValue) {
            this.addToHistory(this.state.searchValue);
            this.setState({ loading: true });
            setTimeout(() => this.setState({ loading: false }), 400);
        }
    }

    addToHistory = (value) => {
        let history = [...this.state.searchHistory].filter(item => item !== value);
        history.unshift(value);
        history = history.slice(0, 10);
        const analytics = { ...this.state.searchAnalytics };
        analytics[value] = (analytics[value] || 0) + 1;
        this.setState({ searchHistory: history, searchAnalytics: analytics });
        localStorage.setItem('searchHistory', JSON.stringify(history));
        localStorage.setItem('searchAnalytics', JSON.stringify(analytics));
    }

    handleClearSearch = () => {
        this.setState({ searchValue: '' });
        this.props.searchMovieProp({ target: { value: '' } });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Escape') this.handleClearSearch();
        else if (e.key === 'Enter') this.handleFormSubmit(e);
    }

    handleFilterChange = (filterType, value) => {
        this.props.onFilterChange(filterType, value);
    }

    getMostSearched = () => {
        return Object.entries(this.state.searchAnalytics)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([movie, count]) => ({ movie, count }));
    }

    render() {
        const { searchValue, loading, showAdvancedFilter } = this.state;
        const filters = this.props.filters || {};

        return (
            <div className="search-section" ref={el => this.searchContainer = el}>
                <form onSubmit={this.handleFormSubmit} className="search-form">

                    {/* ── Search Input ── */}
                    <div className="search-input-group">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                ref={el => this.inputRef = el}
                                value={searchValue}
                                onChange={this.handleSearchChange}
                                onKeyDown={this.handleKeyDown}
                                type="text"
                                className="search-input"
                                placeholder="Film ara... (ör: Inception, Dune)"
                                disabled={loading}
                                aria-label="Film Ara"
                            />
                            {loading && (
                                <div className="search-loader">⟳</div>
                            )}
                            {searchValue && !loading && (
                                <button
                                    type="button"
                                    onClick={this.handleClearSearch}
                                    className="search-clear-btn"
                                    aria-label="Aramayı Temizle"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Filter Toggle ── */}
                    <div className="filter-toggle">
                        <button
                            type="button"
                            onClick={() => this.setState(prev => ({ showAdvancedFilter: !prev.showAdvancedFilter }))}
                            className="filter-toggle-btn"
                        >
                            {showAdvancedFilter ? '▼ Filtreleri Gizle' : '⚙ Gelişmiş Filtreler'}
                        </button>
                    </div>

                    {/* ── Filter Panel ── */}
                    {showAdvancedFilter && (
                        <div className="filter-panel">
                            <div className="filter-grid">
                                <div className="filter-group">
                                    <label className="filter-label">Yapım Yılı</label>
                                    <input
                                        type="number"
                                        className="filter-input"
                                        placeholder="2020"
                                        value={filters.year}
                                        onChange={(e) => this.handleFilterChange('year', e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">Film Türü</label>
                                    <select
                                        className="filter-input"
                                        value={filters.genre}
                                        onChange={(e) => this.handleFilterChange('genre', e.target.value)}
                                    >
                                        <option value="">Tüm Türler</option>
                                        <option value="action">🔥 Aksiyon</option>
                                        <option value="drama">🎭 Drama</option>
                                        <option value="comedy">😂 Komedi</option>
                                        <option value="scifi">🚀 Sci-Fi</option>
                                        <option value="horror">👻 Korku</option>
                                        <option value="romance">💕 Romantik</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">Min. Puan</label>
                                    <input
                                        type="number"
                                        className="filter-input"
                                        placeholder="6.0"
                                        value={filters.rating}
                                        onChange={(e) => this.handleFilterChange('rating', e.target.value)}
                                        min="0"
                                        max="10"
                                        step="0.5"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Trending Searches ── */}
                    {this.getMostSearched().length > 0 && (
                        <div className="most-searched">
                            <span className="most-searched-label">🔥 Trend:</span>
                            <div className="most-searched-items">
                                {this.getMostSearched().map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            this.setState({ searchValue: item.movie });
                                            this.props.searchMovieProp({ target: { value: item.movie } });
                                            this.addToHistory(item.movie);
                                        }}
                                        className="trend-badge"
                                    >
                                        {item.movie}
                                        <span className="count-badge">{item.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        );
    }
}
