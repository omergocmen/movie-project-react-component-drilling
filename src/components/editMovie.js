import React, { Component } from 'react'
import serialize from 'form-serialize';

export default class editMovie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        const parts = window.location.pathname.split('/edit/');
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

    handleFormSubmit = async (e) => {
        e.preventDefault();
        const updatedMovie = serialize(e.target, { hash: true });
        updatedMovie.id = this.state.movie.id;
        updatedMovie.rating = parseFloat(updatedMovie.rating);
        updatedMovie.year = parseInt(updatedMovie.year);

        try {
            await fetch(`http://localhost:3002/movies/${this.state.movie.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMovie)
            });
            alert("Film Başarıyla Güncellendi");
            window.location.href = '/';
        } catch (err) {
            alert('Hata: ' + err.message);
        }
    }

    render() {
        const { movie, loading, error } = this.state;

        if (loading) {
            return (
                <div className="container mt-5">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Film yükleniyor...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="container mt-5">
                    <div className="error-state">
                        <p>❌ {error}</p>
                        <a href="/" className="btn btn-gradient-primary">← Ana Sayfaya Dön</a>
                    </div>
                </div>
            );
        }

        if (!movie) return null;

        return (
            <div className="app-container">
                <div className="back-button-wrapper">
                    <a href="/" className="btn btn-gradient-secondary">← Geri Dön</a>
                </div>

                <div className="form-section" style={{ maxWidth: '700px', margin: '30px auto' }}>
                    <div className="form-header">
                        <h1 className="form-title">✏️ Filmi Düzenle</h1>
                        <p className="form-subtitle">{movie.name}</p>
                    </div>

                    <form onSubmit={this.handleFormSubmit} className="edit-form">
                        {/* Film Adı */}
                        <div className="form-group-wrapper">
                            <label className="form-label">🎞️ Filmin Adı</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                defaultValue={movie.name}
                                placeholder="Film adını giriniz"
                                required
                            />
                        </div>

                        {/* Rating ve Yıl */}
                        <div className="form-row-grid">
                            <div className="form-group-wrapper">
                                <label className="form-label">⭐ Puan (0-10)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="rating"
                                    defaultValue={movie.rating}
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    required
                                />
                            </div>
                            <div className="form-group-wrapper">
                                <label className="form-label">📅 Yıl</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="year"
                                    defaultValue={movie.year}
                                    required
                                />
                            </div>
                        </div>

                        {/* Tür */}
                        <div className="form-group-wrapper">
                            <label className="form-label">🎬 Tür</label>
                            <select
                                className="form-control"
                                name="genre"
                                defaultValue={movie.genre}
                                required
                            >
                                <option value="">Seçiniz...</option>
                                <option value="action">🔥 Aksiyon</option>
                                <option value="drama">🎭 Drama</option>
                                <option value="comedy">😂 Komedi</option>
                                <option value="scifi">🚀 Sci-Fi</option>
                                <option value="horror">👻 Korku</option>
                                <option value="romance">💕 Romantik</option>
                            </select>
                        </div>

                        {/* Poster URL */}
                        <div className="form-group-wrapper">
                            <label className="form-label">🖼️ Posterin URL Adresi</label>
                            <input
                                type="text"
                                className="form-control"
                                name="imageURL"
                                defaultValue={movie.imageURL}
                                placeholder="https://..."
                                required
                            />
                            {movie.imageURL && (
                                <div className="poster-preview">
                                    <p className="preview-label">Ön İzleme:</p>
                                    <img src={movie.imageURL} alt="poster-preview" className="preview-image" />
                                </div>
                            )}
                        </div>

                        {/* Genel Bakış */}
                        <div className="form-group-wrapper">
                            <label className="form-label">📝 Genel Bakış</label>
                            <textarea
                                className="form-control textarea-control"
                                name="overview"
                                rows="6"
                                defaultValue={movie.overview}
                                placeholder="Film hakkında açıklama yazınız..."
                                required
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="form-buttons">
                            <button type="submit" className="btn btn-gradient-primary btn-lg">
                                💾 Filmi Güncelle
                            </button>
                            <a href="/" className="btn btn-gradient-secondary btn-lg">
                                ✕ İptal Et
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
