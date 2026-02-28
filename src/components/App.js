import React, { Component } from "react";
import "../App.css";

import staticMovies from "../data/movies";
import MovieList from "./movieList";
import Searchbar from "./searchbar";
import EditMovie from "./editMovie";
import MovieDetail from "./movieDetail";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AddMovie from "./addMovie";

const STORAGE_KEY = "cinehub_movies";

function loadMovies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return staticMovies;
}

function saveMovies(movies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch (e) { /* ignore */ }
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: loadMovies(),
      searchQuery: "",
      loading: false,
      error: null,
      sortBy: "name",
      sortOrder: "asc",
      filters: {
        year: '',
        genre: '',
        rating: ''
      }
    };
  }

  searchMovie = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  addMovie = (movie) => {
    const maxId = this.state.movies.length > 0
      ? Math.max(...this.state.movies.map(m => parseInt(m.id) || 0))
      : 0;
    const newMovie = {
      ...movie,
      id: String(maxId + 1),
      rating: parseFloat(movie.rating),
      year: parseInt(movie.year)
    };

    const updated = [...this.state.movies, newMovie];
    saveMovies(updated);
    this.setState({ movies: updated });
    alert("Film Başarıyla Eklendi");
    window.location.href = '/';
  };

  updateMovie = (updatedMovie) => {
    const updated = this.state.movies.map(m =>
      String(m.id) === String(updatedMovie.id) ? updatedMovie : m
    );
    saveMovies(updated);
    this.setState({ movies: updated });
    alert("Film Başarıyla Güncellendi");
    window.location.href = '/';
  };

  deleteMovieToUi = (movie) => {
    if (window.confirm(`"${movie.name}" filmini silmek istediğinizden emin misiniz?`)) {
      const updated = this.state.movies.filter(m => String(m.id) !== String(movie.id));
      saveMovies(updated);
      this.setState({ movies: updated });
      alert("Film Silindi");
    }
  };

  applyFilters = (movies) => {
    const { searchQuery, filters } = this.state;
    return movies.filter((movie) => {
      const matchesSearch = movie.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      const matchesYear = !filters.year || movie.year === parseInt(filters.year);
      const matchesGenre = !filters.genre || movie.genre === filters.genre;
      const matchesRating = !filters.rating || parseFloat(movie.rating) >= parseFloat(filters.rating);
      return matchesSearch && matchesYear && matchesGenre && matchesRating;
    });
  };

  applySorting = (movies) => {
    const { sortBy, sortOrder } = this.state;
    const sorted = [...movies];
    sorted.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'rating':
          aValue = parseFloat(a.rating);
          bValue = parseFloat(b.rating);
          break;
        case 'year':
          aValue = a.year || 0;
          bValue = b.year || 0;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  handleSortChange = (sortBy) => {
    if (this.state.sortBy === sortBy) {
      this.setState(prev => ({ sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }));
    } else {
      this.setState({ sortBy, sortOrder: 'asc' });
    }
  };

  handleFilterChange = (filterType, value) => {
    this.setState(prev => ({
      filters: { ...prev.filters, [filterType]: value }
    }));
  };

  render() {
    const filteredMovies = this.applyFilters(this.state.movies);
    const sortedMovies = this.applySorting(filteredMovies);

    return (
      <Router>
        {/* ── NAVBAR ── */}
        <nav className="navbar-custom">
          <div className="navbar-content">
            <a className="branding" href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
              <div className="branding-icon">🎬</div>
              <div>
                <div className="branding-text">CineHub</div>
                <div className="branding-sub">Film Koleksiyonu</div>
              </div>
            </a>
            <div className="navbar-actions">
              <a href="/add" className="btn btn-success" style={{ textDecoration: 'none' }}>
                <span>＋</span> Yeni Film
              </a>
            </div>
          </div>
        </nav>

        <div className="app-container">
          <Routes>
            {/* HOME */}
            <Route
              path="/"
              element={
                <>
                  <Searchbar
                    searchMovieProp={this.searchMovie}
                    onFilterChange={this.handleFilterChange}
                    filters={this.state.filters}
                  />

                  {this.state.error && (
                    <div className="alert alert-danger" style={{ maxWidth: '1400px', margin: '20px auto' }}>
                      ⚠ {this.state.error}
                    </div>
                  )}

                  {this.state.movies.length > 0 && (
                    <div className="filter-controls">
                      <span className="filter-label-sort">Sırala:</span>
                      <button
                        className={`sort-button ${this.state.sortBy === 'name' ? 'active' : ''}`}
                        onClick={() => this.handleSortChange('name')}
                      >
                        İsim {this.state.sortBy === 'name' && (this.state.sortOrder === 'asc' ? '↑' : '↓')}
                      </button>
                      <button
                        className={`sort-button ${this.state.sortBy === 'rating' ? 'active' : ''}`}
                        onClick={() => this.handleSortChange('rating')}
                      >
                        ⭐ Puan {this.state.sortBy === 'rating' && (this.state.sortOrder === 'asc' ? '↑' : '↓')}
                      </button>
                      <button
                        className={`sort-button ${this.state.sortBy === 'year' ? 'active' : ''}`}
                        onClick={() => this.handleSortChange('year')}
                      >
                        Yıl {this.state.sortBy === 'year' && (this.state.sortOrder === 'asc' ? '↑' : '↓')}
                      </button>
                      <span className="film-counter">
                        {sortedMovies.length} / {this.state.movies.length} film
                      </span>
                    </div>
                  )}

                  {sortedMovies.length > 0 && (
                    <div className="movies-grid">
                      <MovieList movies={sortedMovies} deleteMovie={this.deleteMovieToUi} />
                    </div>
                  )}

                  {sortedMovies.length === 0 && this.state.movies.length > 0 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <h5>Film Bulunamadı</h5>
                      <p>Arama kriterlerinize uygun film yok. Filtreleri değiştirmeyi deneyin.</p>
                    </div>
                  )}

                  {this.state.movies.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">🎭</div>
                      <h5>Henüz Film Yok</h5>
                      <p>Koleksiyonunuz başlamayı bekliyor. İlk filmi ekleyin!</p>
                      <a href="/add" className="btn btn-success" style={{ marginTop: '28px', textDecoration: 'none' }}>
                        ＋ İlk Filmi Ekle
                      </a>
                    </div>
                  )}
                </>
              }
            />

            {/* ADD MOVIE */}
            <Route
              path="/add"
              element={
                <div className="detail-container">
                  <AddMovie onAddMovie={this.addMovie} />
                </div>
              }
            />

            {/* EDIT MOVIE */}
            <Route
              path="/edit/:id"
              element={
                <div className="detail-container">
                  <EditMovie
                    movies={this.state.movies}
                    onUpdateMovie={this.updateMovie}
                  />
                </div>
              }
            />

            {/* DETAIL */}
            <Route
              path="/movie/:id"
              element={
                <div className="detail-container">
                  <MovieDetail
                    movies={this.state.movies}
                    onDeleteMovie={this.deleteMovieToUi}
                  />
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    );
  }
}
