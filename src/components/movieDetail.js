import React, { Component } from 'react'

const genreLabels = {
    'action': '🔥 Aksiyon',
    'drama': '🎭 Drama',
    'comedy': '😂 Komedi',
    'scifi': '🚀 Sci-Fi',
    'horror': '👻 Korku',
    'romance': '💕 Romantik'
};

export default class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { movie: null, error: null };
    }

    componentDidMount() {
        this.findMovie();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.movieId !== this.props.movieId) {
            this.findMovie();
        }
    }

    findMovie() {
        const { movieId, movies = [] } = this.props;
        if (!movieId) { this.setState({ error: 'Geçersiz film ID' }); return; }
        const movie = movies.find(m => String(m.id) === String(movieId));
        movie
            ? this.setState({ movie, error: null })
            : this.setState({ error: 'Film bulunamadı', movie: null });
    }

    handleDelete = () => {
        if (window.confirm('Bu filmi silmek istediğinizden emin misiniz?')) {
            this.props.onDeleteMovie(this.state.movie);
            window.location.href = '/';
        }
    }

    render() {
        const { movie, error } = this.state;

        if (error) return (
            <div className="error-state">
                <p>⚠ {error}</p>
                <a href="/" className="btn btn-secondary" style={{ marginTop: '20px', textDecoration: 'none' }}>← Geri Dön</a>
            </div>
        );

        if (!movie) return (
            <div className="loading-state"><div className="spinner"></div></div>
        );

        // Use live data from props so watchlisted/watched flags update instantly
        const liveMovie = (this.props.movies || []).find(m => String(m.id) === String(movie.id)) || movie;

        return (
            <>
                <div className="back-button">
                    <a href="/" className="btn btn-secondary">← Geri Dön</a>
                </div>

                <div className="detail-grid">
                    <div className="detail-poster">
                        <img src={movie.imageURL} alt={movie.name} />
                    </div>

                    <div className="detail-content">
                        <h1>{movie.name}</h1>

                        <div className="detail-meta">
                            <span className="badge rating-badge" style={{
                                background: movie.rating >= 8
                                    ? 'linear-gradient(135deg, #2ed573, #1db954)'
                                    : movie.rating >= 6
                                        ? 'linear-gradient(135deg, #e8b86d, #c99a4a)'
                                        : 'linear-gradient(135deg, #ff4757, #ff6b81)',
                                color: movie.rating >= 6 ? '#1a1208' : 'white'
                            }}>
                                ⭐ {movie.rating}/10
                            </span>
                            {movie.year && <span className="badge bg-info">📅 {movie.year}</span>}
                            {movie.genre && <span className="badge bg-primary">{genreLabels[movie.genre] || movie.genre}</span>}
                        </div>

                        <div className="detail-overview">{movie.overview}</div>

                        <div className="detail-info">
                            <ul>
                                <li><strong>Tür:</strong> {genreLabels[movie.genre] || movie.genre}</li>
                                <li><strong>Yayın Yılı:</strong> {movie.year}</li>
                                <li><strong>IMDb Puanı:</strong> {movie.rating}/10</li>
                            </ul>
                        </div>

                        <div className="button-group">
                            <button
                                className={`btn ${liveMovie.watchlisted ? 'btn-watchlist-active' : 'btn-watchlist'}`}
                                onClick={() => this.props.onToggleWatchlist(movie.id)}
                            >
                                {liveMovie.watchlisted ? '❤️ Listemdeyim' : '🤍 Listeye Ekle'}
                            </button>
                            {liveMovie.watchlisted && (
                                <button
                                    className={`btn ${liveMovie.watched ? 'btn-watched-active' : 'btn-watched'}`}
                                    onClick={() => this.props.onToggleWatched(movie.id)}
                                >
                                    {liveMovie.watched ? '✅ İzledim' : '👁 İzledim Olarak İşaretle'}
                                </button>
                            )}
                            <a href={`/edit/${movie.id}`} className="btn btn-warning" style={{ textDecoration: 'none' }}>
                                ✎ Filmi Düzenle
                            </a>
                            <button onClick={this.handleDelete} className="btn btn-danger">
                                🗑 Filmi Sil
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
