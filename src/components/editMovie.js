import React, { Component } from 'react'
import serialize from 'form-serialize';

export default class editMovie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            error: null
        };
    }

    componentDidMount() {
        const parts = window.location.pathname.split('/edit/');
        const movieId = parts[1] ? parts[1].replace(/\//g, '') : null;

        if (!movieId) {
            this.setState({ error: 'Geçersiz film ID' });
            return;
        }

        // Props'tan ya da statik listeden bul
        const movies = this.props.movies || [];
        const movie = movies.find(m => String(m.id) === String(movieId));

        if (movie) {
            this.setState({ movie });
        } else {
            this.setState({ error: 'Film bulunamadı' });
        }
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const data = serialize(e.target, { hash: true });
        const updatedMovie = {
            ...this.state.movie,
            ...data,
            rating: parseFloat(data.rating),
            year: parseInt(data.year)
        };
        this.props.onUpdateMovie(updatedMovie);
    }

    render() {
        const { movie, error } = this.state;

        if (error) {
            return (
                <div className="error-state">
                    <p>❌ {error}</p>
                    <a href="/" className="btn btn-gradient-primary">← Ana Sayfaya Dön</a>
                </div>
            );
        }

        if (!movie) {
            return (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Film yükleniyor...</p>
                </div>
            );
        }

        return (
            <div className="app-container">
                <div className="back-button-wrapper">
                    <a href="/" className="btn btn-secondary">← Geri Dön</a>
                </div>

                <div className="form-section" style={{ maxWidth: '700px', margin: '30px auto' }}>
                    <div className="form-header">
                        <h1 className="form-title">✏️ Filmi Düzenle</h1>
                        <p className="form-subtitle">{movie.name}</p>
                    </div>

                    <form onSubmit={this.handleFormSubmit} className="edit-form">
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

                        <div className="form-buttons">
                            <button type="submit" className="btn btn-gradient-primary btn-lg">
                                💾 Filmi Güncelle
                            </button>
                            <a href="/" className="btn btn-secondary btn-lg">
                                ✕ İptal Et
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
