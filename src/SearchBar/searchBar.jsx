import React from 'react';
import "./searchBar.css"

const SearchBar = () => {
    return (
        <div className="container ">
            <div className="row justify-content-center mb-5 ">
                <div className="col-md-6  ">
                    <form className="d-flex">
                        <div className="input-group rounded-3 overflow-hidden shadow" >
                            <input className="form-control form-control-lg" type="search" placeholder="Search"
                                   aria-label="Search"/>
                            <button className="btn btn-primary px-4 button-design" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;