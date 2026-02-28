
import React, { Component } from 'react'
import serialize from 'form-serialize';

export default class addMovie extends Component {

    handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Validasyon
        const form = e.target;
        const name = form.name.value.trim();
        const rating = parseFloat(form.rating.value);
        const imageURL = form.imageURL.value.trim();
        const overview = form.overview.value.trim();
        const genre = form.genre.value;
        const year = form.year.value;

        if (!name || !rating || !imageURL || !overview || !genre || !year) {
            alert('Lütfen tüm alanları doldurunuz');
            return;
        }

        if (rating < 0 || rating > 10) {
            alert('Puan 0 ile 10 arasında olmalıdır');
            return;
        }

        const newMovie = serialize(form, { hash: true });
        newMovie.rating = parseFloat(newMovie.rating);
        newMovie.year = parseInt(newMovie.year);
        this.props.onAddMovie(newMovie);
    }

    render() {
        const currentYear = new Date().getFullYear();
        
        return  (
            <div className="form-section">
                <div className="back-button">
                    <a href="/" className="btn btn-secondary">← Geri Dön</a>
                </div>

                <h2>🎬 Yeni Film Ekle</h2>

                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Filmin Adı *</label>
                            <input  
                                type="text" 
                                className="form-control" 
                                name="name"
                                placeholder="Örn: Inception"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Puan (0-10) *</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                name="rating"
                                placeholder="8.5"
                                step="0.1"
                                min="0"
                                max="10"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Yıl *</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                name="year"
                                placeholder={currentYear}
                                min="1900"
                                max={currentYear}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tür *</label>
                        <select className="form-control" name="genre" required>
                            <option value="">Seç...</option>
                            <option value="action">🔥 Aksiyon</option>
                            <option value="drama">🎭 Drama</option>
                            <option value="comedy">😂 Komedi</option>
                            <option value="scifi">🚀 Sci-Fi</option>
                            <option value="horror">👻 Korku</option>
                            <option value="romance">💕 Romantik</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Posterin URL Adresi *</label>
                        <input 
                            type="url" 
                            className="form-control" 
                            name="imageURL"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Genel Bakış *</label>
                        <textarea 
                            className="form-control" 
                            name="overview" 
                            placeholder="Film hakkında kısa bilgi..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        ➕ Filmi Ekle
                    </button>
                </form>
            </div>
        )
    }
}


