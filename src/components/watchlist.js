import React, { Component } from "react";

const genreLabels = {
    'action': '🔥 Aksiyon',
    'drama': '🎭 Drama',
    'comedy': '😂 Komedi',
    'scifi': '🚀 Sci-Fi',
    'horror': '👻 Korku',
    'romance': '💕 Romantik'
};

export default class Watchlist extends Component {
    render() {
        const { movies = [], onToggleWatchlist, onToggleWatched, onDeleteMovie } = this.props;
        const watchlisted = movies.filter(m => m.watchlisted);
        const watched = watchlisted.filter(m => m.watched);
        const toWatch = watchlisted.filter(m => !m.watched);

        return (
            <div className="watchlist-page">
                {/* ── Header ── */}
                <div className="watchlist-header">
                    <a href="/" className="btn btn-secondary" style={{ textDecoration: 'none', marginBottom: '24px', display: 'inline-flex' }}>
                        ← Geri Dön
                    </a>
                    <h1 className="watchlist-title">❤️ İzleme Listem</h1>
                    <div className="watchlist-stats">
                        <div className="wl-stat">
                            <span className="wl-stat-number">{watchlisted.length}</span>
                            <span className="wl-stat-label">Listede</span>
                        </div>
                        <div className="wl-stat-divider" />
                        <div className="wl-stat">
                            <span className="wl-stat-number" style={{ color: 'var(--green)' }}>{watched.length}</span>
                            <span className="wl-stat-label">İzlendi</span>
                        </div>
                        <div className="wl-stat-divider" />
                        <div className="wl-stat">
                            <span className="wl-stat-number" style={{ color: 'var(--gold)' }}>{toWatch.length}</span>
                            <span className="wl-stat-label">Bekliyor</span>
                        </div>
                    </div>
                </div>

                {/* ── Empty State ── */}
                {watchlisted.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🤍</div>
                        <h5>Listeniz Boş</h5>
                        <p>Film kartlarındaki ❤️ butonuna tıklayarak filmleri listenize ekleyin.</p>
                        <a href="/" className="btn btn-success" style={{ marginTop: '24px', textDecoration: 'none' }}>
                            Filmlere Göz At
                        </a>
                    </div>
                )}

                {/* ── To Watch Section ── */}
                {toWatch.length > 0 && (
                    <section className="wl-section">
                        <h2 className="wl-section-title">
                            <span className="wl-section-icon">🎬</span>
                            İzlenecekler
                            <span className="wl-section-count">{toWatch.length}</span>
                        </h2>
                        <div className="wl-grid">
                            {toWatch.map(movie => (
                                <WatchlistCard
                                    key={movie.id}
                                    movie={movie}
                                    onToggleWatchlist={onToggleWatchlist}
                                    onToggleWatched={onToggleWatched}
                                    onDeleteMovie={onDeleteMovie}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Watched Section ── */}
                {watched.length > 0 && (
                    <section className="wl-section">
                        <h2 className="wl-section-title">
                            <span className="wl-section-icon">✅</span>
                            İzlenenler
                            <span className="wl-section-count" style={{ background: 'rgba(46,213,115,0.15)', color: 'var(--green)', borderColor: 'rgba(46,213,115,0.3)' }}>{watched.length}</span>
                        </h2>
                        <div className="wl-grid">
                            {watched.map(movie => (
                                <WatchlistCard
                                    key={movie.id}
                                    movie={movie}
                                    onToggleWatchlist={onToggleWatchlist}
                                    onToggleWatched={onToggleWatched}
                                    onDeleteMovie={onDeleteMovie}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        );
    }
}

/* ── Watchlist Card ── */
function WatchlistCard({ movie, onToggleWatchlist, onToggleWatched, onDeleteMovie }) {
    return (
        <div className={`wl-card ${movie.watched ? 'wl-card-watched' : ''}`}>
            {/* Poster */}
            <div className="wl-card-poster">
                <img src={movie.imageURL} alt={movie.name}
                    onError={e => { e.target.style.display = 'none'; }}
                />
                {movie.watched && <div className="wl-watched-overlay">✅</div>}
            </div>

            {/* Info */}
            <div className="wl-card-body">
                <h3 className="wl-card-title">{movie.name}</h3>
                <div className="wl-card-meta">
                    <span className="wl-badge-rating">⭐ {movie.rating}</span>
                    {movie.year && <span className="wl-badge-year">{movie.year}</span>}
                    {movie.genre && <span className="wl-badge-genre">{genreLabels[movie.genre] || movie.genre}</span>}
                </div>
                <p className="wl-card-overview">{movie.overview?.substring(0, 100)}...</p>

                {/* Actions */}
                <div className="wl-card-actions">
                    <a href={`/movie/${movie.id}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        Detay
                    </a>
                    <button
                        className={`btn btn-sm ${movie.watched ? 'btn-watched-active' : 'btn-watched'}`}
                        onClick={() => onToggleWatched(movie.id)}
                    >
                        {movie.watched ? '✅ İzledim' : '👁 İzledim'}
                    </button>
                    <button
                        className="btn btn-outline-remove btn-sm"
                        onClick={() => onToggleWatchlist(movie.id)}
                        title="Listeden Çıkar"
                    >
                        🗑 Çıkar
                    </button>
                </div>
            </div>
        </div>
    );
}
