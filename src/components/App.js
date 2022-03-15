import React, { Component } from "react";
import axios from "axios";
import MovieList from "./movieList";
import Searchbar from "./searchbar";


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes
} from "react-router-dom";
import AddMovie from "./addMovie";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      searchQuery: ""
    };
  }

  searchMovie = (event) => {
    this.setState({ searchQuery: event.target.value });
  };



  addMovie = async (movie) => {
    movie.id=this.state.movies.length+1;
    await axios.post(`http://localhost:3000/movies/`, movie)
    this.setState(state => ({
        movies: state.movies.concat([movie])
    }))
    alert("Film Başarıyla Eklendi")
    this.getMovies();
}





  deleteMovieToUi = async (movie) => {
    await axios.delete(`http://localhost:3000/movies/${movie.id}`);
    const newMovieList = this.state.movies.filter((m) => m.id !== movie.id);
    this.setState((state) => ({
      movies: newMovieList,
    }));
  };

  componentDidMount() {
    this.getMovies();
  }

  async getMovies() {
    const response = await axios.get("http://localhost:3000/movies");
    this.setState({ movies: response.data });
  }

  render() {
    let filteredMovies = this.state.movies.filter((movie) => {
      return (
        movie.name
          .toLowerCase()
          .indexOf(this.state.searchQuery.toLowerCase()) !== -1
      );
    });
    return (
      <div className="container">
        <Router>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <React.Fragment>
                  <Searchbar searchMovieProp={this.searchMovie} />
                  <MovieList movies={filteredMovies} deleteMovie={this.deleteMovieToUi}/>
                </React.Fragment>
              }
            />

            <Route
              path="/add"
              exact
              element={
                <React.Fragment>
                  <AddMovie onAddMovie={this.addMovie} />
                </React.Fragment>
              }
            />
          </Routes>
        </Router>
      </div>
    );
  }
}
