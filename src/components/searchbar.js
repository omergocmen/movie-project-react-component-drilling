import React, { Component } from 'react'

export default class searchbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchHistory: [],
            suggestions: [],
            loading: false,
            showDropdown: false,
            showHistoryDropdown: false,
            filters: {
                year: '',
                genre: '',
                rating: ''
            },
            showAdvancedFilter: false,
            searchAnalytics: {},
            minCharacterWarning: false
        };
        this.debounceTimer = null;
        this.MIN_CHARACTERS = 2;
    }

    componentDidMount() {
        // localStorage'dan arama geçmişini yükle
        const savedHistory = localStorage.getItem('searchHistory');
        const savedAnalytics = localStorage.getItem('searchAnalytics');
        
        if (savedHistory) {
            this.setState({ searchHistory: JSON.parse(savedHistory) });
        }
        if (savedAnalytics) {
            this.setState({ searchAnalytics: JSON.parse(savedAnalytics) });
        }

        // Dışarıdan tıklanırsa dropdown'ı kapat
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }

    handleOutsideClick = (e) => {
        if (this.searchContainer && !this.searchContainer.contains(e.target)) {
            this.setState({ showDropdown: false, showHistoryDropdown: false });
        }
    }

    // Debounce mekanizması
    debounceSearch = (value) => {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.generateSuggestions(value);
            this.props.searchMovieProp({ target: { value } });
        }, 300);
    }

    // Öneriler oluştur
    generateSuggestions = (value) => {
        if (value.length >= this.MIN_CHARACTERS) {
            // Mock filmler (API'den gelecek)
            const mockMovies = [
                'Inception', 'Interstellar', 'The Dark Knight', 
                'Fight Club', 'Pulp Fiction', 'The Matrix',
                'Forrest Gump', 'Titanic', 'Avatar'
            ];
            
            const filtered = mockMovies.filter(movie => 
                movie.toLowerCase().includes(value.toLowerCase())
            );
            
            this.setState({ 
                suggestions: filtered.slice(0, 5),
                showDropdown: true,
                minCharacterWarning: false
            });
        } else if (value.length > 0) {
            this.setState({ 
                suggestions: [],
                minCharacterWarning: true,
                showDropdown: false
            });
        }
    }

    handleSearchChange = (e) => {
        const value = e.target.value;
        this.setState({ searchValue: value });
        this.debounceSearch(value);
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (this.state.searchValue.length < this.MIN_CHARACTERS) {
            alert(`En az ${this.MIN_CHARACTERS} karakter giriniz`);
            return;
        }

        this.addToHistory(this.state.searchValue);
        this.setState({ loading: true });
        
        // Mock loading durumu
        setTimeout(() => {
            this.setState({ loading: false, showDropdown: false });
            console.log('Film Aranıyor:', this.state.searchValue, 'Filtreler:', this.state.filters);
        }, 500);
    }

    // Arama geçmişine ekle
    addToHistory = (value) => {
        let history = [...this.state.searchHistory];
        
        // Zaten vardı ise önce sil
        history = history.filter(item => item !== value);
        
        // Başa ekle
        history.unshift(value);
        
        // En son 10'u tut
        history = history.slice(0, 10);
        
        // Analytics güncelle
        const analytics = { ...this.state.searchAnalytics };
        analytics[value] = (analytics[value] || 0) + 1;
        
        this.setState({ searchHistory: history, searchAnalytics: analytics });
        
        // localStorage'a kaydet
        localStorage.setItem('searchHistory', JSON.stringify(history));
        localStorage.setItem('searchAnalytics', JSON.stringify(analytics));
    }

    handleClearSearch = () => {
        this.setState({ searchValue: '', suggestions: [], minCharacterWarning: false });
    }

    handleSelectSuggestion = (suggestion) => {
        this.setState({ searchValue: suggestion, showDropdown: false });
        this.addToHistory(suggestion);
    }

    handleSelectHistory = (item) => {
        this.setState({ searchValue: item, showHistoryDropdown: false });
    }

    handleFilterChange = (filterType, value) => {
        this.setState(prev => ({
            filters: {
                ...prev.filters,
                [filterType]: value
            }
        }));
    }

    handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.handleClearSearch();
        } else if (e.key === 'Enter') {
            this.handleFormSubmit(e);
        }
    }

    // En çok aranan filmleri getir
    getMostSearched = () => {
        return Object.entries(this.state.searchAnalytics)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([movie, count]) => ({ movie, count }));
    }

    render() {
        const { searchValue, searchHistory, suggestions, loading, filters, showAdvancedFilter, minCharacterWarning } = this.state;
        const filteredHistory = searchHistory.filter(item => 
            item.toLowerCase().includes(searchValue.toLowerCase())
        );

        return (
            <div ref={el => this.searchContainer = el}>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-row d-flex mt-2" style={{justifyContent:"space-between"}}>
                        <div className="col-8">
                            <div style={{position: 'relative'}}>
                                {loading && (
                                    <div style={{position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', color: '#666'}}>
                                        ⟳ Yükleniyor...
                                    </div>
                                )}
                                <input 
                                    ref={el => this.inputRef = el}
                                    value={searchValue}
                                    onChange={this.handleSearchChange}
                                    onKeyDown={this.handleKeyDown}
                                    onFocus={() => this.setState({ showHistoryDropdown: true })}
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Film Ara (En az 2 karakter)" 
                                    disabled={loading}
                                />
                                {searchValue && (
                                    <button 
                                        type="button" 
                                        onClick={this.handleClearSearch}
                                        style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px'}}
                                        disabled={loading}
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Validation Warning */}
                                {minCharacterWarning && (
                                    <small style={{color: '#d32f2f', display: 'block', marginTop: '5px'}}>
                                        ⚠ En az {this.MIN_CHARACTERS} karakter giriniz
                                    </small>
                                )}

                                {/* Suggestions Dropdown */}
                                {this.state.showDropdown && suggestions.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderTop: 'none',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{padding: '5px 0', fontSize: '12px', color: '#999', paddingLeft: '10px', paddingTop: '10px'}}>
                                            Öneriler:
                                        </div>
                                        {suggestions.map((suggestion, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => this.handleSelectSuggestion(suggestion)}
                                                style={{
                                                    padding: '10px 15px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    backgroundColor: idx === 0 ? '#f5f5f5' : 'white'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = idx === 0 ? '#f5f5f5' : 'white'}
                                            >
                                                🎬 {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* History Dropdown */}
                                {this.state.showHistoryDropdown && !this.state.showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderTop: 'none',
                                        maxHeight: '250px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        {filteredHistory.length > 0 ? (
                                            <>
                                                <div style={{padding: '5px 0', fontSize: '12px', color: '#999', paddingLeft: '10px', paddingTop: '10px', fontWeight: 'bold'}}>
                                                    Son Aramalar:
                                                </div>
                                                {filteredHistory.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => this.handleSelectHistory(item)}
                                                        style={{
                                                            padding: '10px 15px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #f0f0f0',
                                                            display: 'flex',
                                                            justifyContent: 'space-between'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                    >
                                                        <span>⏱ {item}</span>
                                                        <span style={{color: '#999', fontSize: '12px'}}>({this.state.searchAnalytics[item] || 0})</span>
                                                    </div>
                                                ))}
                                            </>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-2">
                            <a type="button" className="btn btn-success" href="http://localhost:3001/add">Yeni Film Ekle</a>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="mt-3">
                        <button 
                            type="button"
                            onClick={() => this.setState(prev => ({ showAdvancedFilter: !prev.showAdvancedFilter }))}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                padding: 0
                            }}
                        >
                            {showAdvancedFilter ? '▼ Gelişmiş Filtreleri Gizle' : '▶ Gelişmiş Filtreler'}
                        </button>
                    </div>

                    {showAdvancedFilter && (
                        <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}>
                            <div className="row">
                                <div className="col-4">
                                    <label style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Yıl:</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-sm"
                                        placeholder="2020"
                                        value={filters.year}
                                        onChange={(e) => this.handleFilterChange('year', e.target.value)}
                                    />
                                </div>
                                <div className="col-4">
                                    <label style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Tür:</label>
                                    <select 
                                        className="form-control form-control-sm"
                                        value={filters.genre}
                                        onChange={(e) => this.handleFilterChange('genre', e.target.value)}
                                    >
                                        <option value="">Seç...</option>
                                        <option value="action">Aksiyon</option>
                                        <option value="drama">Drama</option>
                                        <option value="comedy">Komedi</option>
                                        <option value="scifi">Sci-Fi</option>
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label style={{fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Min. Puan:</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-sm"
                                        placeholder="5.0"
                                        value={filters.rating}
                                        onChange={(e) => this.handleFilterChange('rating', e.target.value)}
                                        min="0"
                                        max="10"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Popular Searches */}
                    {this.getMostSearched().length > 0 && (
                        <div style={{marginTop: '10px', fontSize: '12px'}}>
                            <strong>En Çok Aranan:</strong> 
                            {this.getMostSearched().map((item, idx) => (
                                <span key={idx} style={{marginLeft: '10px', marginRight: '10px'}}>
                                    <button 
                                        type="button"
                                        onClick={() => { this.setState({ searchValue: item.movie }); this.handleFormSubmit({ preventDefault: () => {} }); }}
                                        style={{
                                            background: '#e8f5e9',
                                            border: '1px solid #4caf50',
                                            padding: '3px 8px',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            marginRight: '5px'
                                        }}
                                    >
                                        {item.movie} ({item.count})
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </form>
            </div>
        )
    }
}
