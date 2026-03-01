import React, { Component } from "react";

const genreLabels = {
  'action': '🔥 Aksiyon',
  'drama': '🎭 Drama',
  'comedy': '😂 Komedi',
  'scifi': '🚀 Sci-Fi',
  'horror': '👻 Korku',
  'romance': '💕 Romantik'
};

const getRatingColor = (rating) => {
  const r = parseFloat(rating);
  if (r >= 8) return 'bg-success';
  if (r >= 6) return 'bg-warning';
  return 'bg-danger';
};

export default class movieList extends Component {
  render() {
    if (this.props.movies.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h5>Film Bulunamadı</h5>
          <p>Arama kriterlerinize uygun film yoktur.</p>
        </div>
      );
    }

    return (
      <>
        {this.props.movies.map((movie) => (
          <div key={movie.id} className="card">
            {/* ── Poster Image ── */}
            <div className="card-img-container">
              <img
                src={movie.imageURL}
                className="card-img-top"
                alt={movie.name}
                onError={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
                  e.target.style.display = 'none';
                }}
              />

              {/* Rating badge on image */}
              <div className={`card-rating-badge ${getRatingColor(movie.rating)}`}>
                ⭐ {movie.rating}
              </div>

              {/* Watchlist heart button */}
              <button
                className={`card-watchlist-btn ${movie.watchlisted ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); this.props.onToggleWatchlist(movie.id); }}
                title={movie.watchlisted ? 'Listeden Çıkar' : 'Listeye Ekle'}
              >
                {movie.watchlisted ? '❤️' : '🤍'}
              </button>

              {/* Hover overlay with Quick View button */}
              <div className="card-img-overlay">
                <a
                  href={`/movie/${movie.id}`}
                  className="overlay-btn"
                  style={{ textDecoration: 'none' }}
                >
                  Detay →
                </a>
              </div>
            </div>

            {/* ── Card Body ── */}
            <div className="card-body">
              <h5 className="card-title">{movie.name}</h5>

              <div className="card-meta-row">
                {movie.genre && (
                  <span className="badge bg-info">
                    {genreLabels[movie.genre] || movie.genre}
                  </span>
                )}
                {movie.year && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {movie.year}
                  </span>
                )}
              </div>

              <p className="card-text">
                {movie.overview.substring(0, 90)}...
              </p>

              {/* Action Buttons */}
              <div className="btn-group">
                <a href={`/movie/${movie.id}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                  Detay
                </a>
                <a href={`/edit/${movie.id}`} className="btn btn-warning btn-sm" style={{ textDecoration: 'none' }}>
                  Düzenle
                </a>
                <button
                  type="button"
                  onClick={() => { this.props.deleteMovie(movie); }}
                  className="btn btn-danger btn-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}
