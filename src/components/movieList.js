import React, { Component } from "react";

export default class movieList extends Component {
  render() {
    return (
        <div className="row row-cols-1 row-cols-md-3 g-4 m-auto">
        {this.props.movies.map((movie) => (
            <div className="col" key={movie.id} >
              <div className="card h-100">
                <img src={movie.imageURL} class="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <p className="card-text">
                    {movie.overview}
                  </p>
                  <div className="d-flex justify-content-between">
                  <button type="button" onClick={()=>{this.props.deleteMovie(movie)}} className="btn btn-danger">Filmi Sil</button>
                  <span className="badge bg-primary">{movie.rating}</span>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>
    );
  }
}
