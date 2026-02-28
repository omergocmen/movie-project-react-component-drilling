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
        this.state = {
            movie: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        const parts = window.location.pathname.split('/movie/');
        const movieId = parts[1] ? parts[1].replace(/\//g, '') : null;
        if (movieId) {
            this.loadMovie(movieId);
        } else {
            this.setState({ error: 'Geçersiz film ID', loading: false });
        }
    }

    loadMovie = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3002/movies/${movieId}`);
            if (!response.ok) {
                this.setState({ error: 'Film bulunamadı', loading: false });
                return;
            }
            const movie = await response.json();
            this.setState({ movie, loading: false });
        } catch (err) {
            this.setState({ error: err.message, loading: false });
        }
    }

    handleDelete = async () => {
        if (window.confirm('Bu filmi silmek istediğinizden emin misiniz?')) {
            try {
                await fetch(`http://localhost:3002/movies/${this.state.movie.id}`, {
                    method: 'DELETE'
                });
                window.location.href = '/';
            } catch (err) {
                alert('Silme hatası: ' + err.message);
            }
        }
    }

    render() {
        const { movie, loading, error } = this.state;

        if (loading) return (
            <div className="detail-container">
                <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    ⟳ Yükleniyor...
                </p>
            </div>
        );

        if (error) return (
            <div className="detail-container">
                <p style={{ textAlign: 'center', color: '#ff6b6b', fontSize: '16px' }}>
                    ⚠ {error}
                </p>
                <a href="/" className="btn btn-secondary" style={{ marginTop: '20px', textDecoration: 'none' }}>
                    ← Geri Dön
                </a>
            </div>
        );

        if (!movie) return null;

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
                                background: movie.rating >= 8 ? 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' :
                                    movie.rating >= 7 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                        movie.rating >= 6 ? 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)' :
                                            'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
                            }}>
                                ⭐ {movie.rating}/10
                            </span>
                            {movie.year && (
                                <span className="badge bg-info">
                                    📅 {movie.year}
                                </span>
                            )}
                            {movie.genre && (
                                <span className="badge bg-primary">
                                    {genreLabels[movie.genre] || movie.genre}
                                </span>
                            )}
                        </div>

                        <div className="detail-overview">
                            {movie.overview}
                        </div>

                        <div className="detail-info">
                            <ul>
                                <li>
                                    <strong>Tür:</strong> {genreLabels[movie.genre] || movie.genre}
                                </li>
                                <li>
                                    <strong>Yayın Yılı:</strong> {movie.year}
                                </li>
                                <li>
                                    <strong>IMDb Puanı:</strong> {movie.rating}/10
                                </li>
                            </ul>
                        </div>

                        <div className="button-group">
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
