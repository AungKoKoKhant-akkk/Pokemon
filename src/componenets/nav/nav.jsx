import React from 'react';
import './nav.css';
import {assets} from "../../assets/image.js";

const Nav = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center flex-column nav_main">
            <div className="nav_banner">
                <img className="banner " src={assets.pokemon} height="500" width="auto"/>
            </div>


        </div>
    );
};

export default Nav;