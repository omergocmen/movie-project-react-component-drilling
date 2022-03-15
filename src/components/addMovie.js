
import React, { Component } from 'react'
import serialize from 'form-serialize';




export default class addMovie extends Component {

    handleFormSubmit = (e) => {
        e.preventDefault();
        const newMovie = serialize(e.target, { hash: true });
        this.props.onAddMovie(newMovie);
    }

    render() {
        
        return  (
            <div className="container">
            <form className="mt-5" onSubmit={this.handleFormSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-10">
                        <label htmlFor="inputName">Filmin Adı</label>
                        <input  type="text" 
                                className="form-control" 
                                name="name"/>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="inputRating">Reyting</label>
                        <input 
                                type="text" 
                                className="form-control" 
                                name="rating"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="inputImage">Posterin URL Adresi</label>
                        <input 
                                type="text" 
                                className="form-control" 
                                name="imageURL"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="overviewTextarea">Genel Bakış</label>
                        <textarea 
                                className="form-control" 
                                name="overview" rows="5"></textarea>
                    </div>
                </div>
                <button type="Submit" className="btn btn-success mt-2">Filmi Ekle</button>
            </form>
        </div>
        )

    }
}

