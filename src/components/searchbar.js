import React, { Component } from 'react'

export default class searchbar extends Component {
    render() {

        return  (
            <form onSubmit={this.handleFormSubmit}>
                <div className="form-row d-flex mt-2" style={{justifyContent:"space-between"}}>
                    <div className="col-8">
                        <input 
                            onChange={this.props.searchMovieProp} 
                            type="text" className="form-control" 
                            placeholder="Film Ara" 
                        />
                    </div>
                    <div className="col-2">
                    <a type="button" class="btn btn-success" href="http://localhost:3001/add">Yeni Film Ekle</a>
                    </div>
                </div>
            </form>
        )

    }
}
