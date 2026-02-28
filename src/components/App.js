import React, { Component } from "react";
import "../App.css";

import staticMovies from "../data/movies";
import "../App.css";

import staticMovies from "../data/movies";
import MovieList from "./movieList";
import Searchbar from "./searchbar";
import EditMovie from "./editMovie";
import MovieDetail from "./movieDetail";
import AddMovie from "./addMovie";

import {
  BrowserRouter as Router,
  Routes,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

/* ── useParams wrappers (class components don't support hooks directly) ── */
function MovieDetailWrapper({ movies, onDeleteMovie }) {
  const { id } = useParams();
  return <MovieDetail movieId={id} movies={movies} onDeleteMovie={onDeleteMovie} />;
}

function EditMovieWrapper({ movies, onUpdateMovie }) {
  const { id } = useParams();
  return <EditMovie movieId={id} movies={movies} onUpdateMovie={onUpdateMovie} />;
}

/* ── localStorage persistence ── */
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

/* ── App ── */
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: loadMovies(),
      searchQuery: "",
      sortBy: "name",
      sortOrder: "asc",
      filters: { year: '', genre: '', rating: '' }
    };
  }

  searchMovie = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  addMovie = (movie) => {
    const ids = this.state.movies.map(m => parseInt(m.id) || 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const newMovie = {
      ...movie,
      id: String(maxId + 1),
      rating: parseFloat(movie.rating),
      year: parseInt(movie.year),
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
    }
  };

  applyFilters = (movies) => {
    const { searchQuery, filters } = this.state;
    return movies.filter((movie) => {
      const matchesSearch = movie.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = !filters.year || String(movie.year) === String(filters.year);
      const matchesGenre = !filters.genre || movie.genre === filters.genre;
      const matchesRating = !filters.rating || parseFloat(movie.rating) >= parseFloat(filters.rating);
      return matchesSearch && matchesYear && matchesGenre && matchesRating;
    });
  };

  applySorting = (movies) => {
    const { sortBy, sortOrder } = this.state;
    return [...movies].sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'rating') { aVal = parseFloat(a.rating); bVal = parseFloat(b.rating); }
      else if (sortBy === 'year') { aVal = a.year || 0; bVal = b.year || 0; }
      else { aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  handleSortChange = (sortBy) => {
    if (this.state.sortBy === sortBy) {
      this.setState(prev => ({ sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }));
    } else {
      this.setState({ sortBy, sortOrder: 'asc' });
    }
  };

  handleFilterChange = (filterType, value) => {
    this.setState(prev => ({ filters: { ...prev.filters, [filterType]: value } }));
  };

  render() {
    const filteredMovies = this.applyFilters(this.state.movies);
    const sortedMovies = this.applySorting(filteredMovies);
    const { movies } = this.state;

    return (
      <Router>
        {/* ── NAVBAR ── */}
        <nav className="navbar-custom">
          <div className="navbar-content">
            <a className="branding" href="/">
              <div className="branding-icon">🎬</div>
              <div>
                <div className="branding-text">CineHub</div>
                <div className="branding-sub">Film Koleksiyonu</div>
              </div>
            </a>
            <div className="navbar-actions">
              <a href="/add" className="btn btn-success" style={{ textDecoration: 'none' }}>
                ＋ Yeni Film
              </a>
            </div>
          </div>
        </nav>

        <div className="app-container">
          <Routes>

            {/* HOME */}
            <Route path="/" element={
              <>
                <Searchbar
                  searchMovieProp={this.searchMovie}
                  onFilterChange={this.handleFilterChange}
                  filters={this.state.filters}
                />

                {movies.length > 0 && (
                  <div className="filter-controls">
                    <span className="filter-label-sort">Sırala:</span>
                    {['name', 'rating', 'year'].map(key => (
                      <button
                        key={key}
                        className={`sort-button ${this.state.sortBy === key ? 'active' : ''}`}
                        onClick={() => this.handleSortChange(key)}
                      >
                        {key === 'name' ? 'İsim' : key === 'rating' ? '⭐ Puan' : 'Yıl'}
                        {this.state.sortBy === key && (this.state.sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    ))}
                    <span className="film-counter">{sortedMovies.length} / {movies.length} film</span>
                  </div>
                )}

                {sortedMovies.length > 0 && (
                  <div className="movies-grid">
                    <MovieList movies={sortedMovies} deleteMovie={this.deleteMovieToUi} />
                  </div>
                )}

                {sortedMovies.length === 0 && movies.length > 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h5>Film Bulunamadı</h5>
                    <p>Arama kriterlerinize uygun film yok.</p>
                  </div>
                )}

                {movies.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">🎭</div>
                    <h5>Henüz Film Yok</h5>
                    <p>İlk filmi ekleyin!</p>
                    <a href="/add" className="btn btn-success" style={{ marginTop: '28px', textDecoration: 'none' }}>
                      ＋ İlk Filmi Ekle
                    </a>
                  </div>
                )}
              </>
            } />

            {/* ADD */}
            <Route path="/add" element={
              <div className="detail-container">
                <AddMovie onAddMovie={this.addMovie} />
              </div>
            } />

            {/* EDIT — useParams wrapper passes id as prop */}
            <Route path="/edit/:id" element={
              <div className="detail-container">
                <EditMovieWrapper
                  movies={movies}
                  onUpdateMovie={this.updateMovie}
                />
              </div>
            } />

            {/* DETAIL — useParams wrapper passes id as prop */}
            <Route path="/movie/:id" element={
              <div className="detail-container">
                <MovieDetailWrapper
                  movies={movies}
                  onDeleteMovie={this.deleteMovieToUi}
                />
              </div>
            } />

          </Routes>
        </div>
      </Router>
        </div >
      </Router >
    );
  }
}
