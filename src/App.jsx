import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from "./componenets/nav/nav.jsx";
import SearchBar from "./SearchBar/searchBar.jsx";
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import Categories from "./pages/components/categories/categories.jsx";
import PokemonDetail from "./pages/PokemonDetail/PokemonDetail.jsx";

const App = () => {
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={
                    <>
                        <SearchBar />
                        <Categories />
                    </>
                } />
                <Route path="/pokemon/:name" element={<PokemonDetail />} />
            </Routes>
        </div>
    );
};

export default App;