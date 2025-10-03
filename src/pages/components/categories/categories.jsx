import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonTypes, listCategories } from "../../../services/categories.js";
import Pagination from "../../pagination/pagination.jsx";


const CARDS_PER_PAGE = 6;
const Categories = () => {
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterPokemon, setFilterPokemon] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('All');

    const fetchPokemon = async () => {
        try {
            const detailedPokemon = await listCategories();
            const allTypes = await getPokemonTypes();
            setPokemon(detailedPokemon);
            setLoading(false);
            setPokemon(detailedPokemon);
            setTypes(allTypes);
            console.log(allTypes);
            // console.log(detailedPokemon);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, []);

    const totalPages = Math.ceil(pokemon.length / CARDS_PER_PAGE);
    const startIdx = (currentPage - 1) * CARDS_PER_PAGE;
    const currentCards = pokemon.slice(startIdx, startIdx + CARDS_PER_PAGE);

    return (
        <div className="container">
            <p>
                {loading ? "Loading... API" : ""}
            </p>

            {/*Filter Button*/}



            <div className="row mt-2 m-5">
                {currentCards.map((p, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                        <div className="card" style={{ maxWidth: 320 }}>
                            <img
                                src={p.image} style={{ maxHeight: 200 }}
                                className="card-img-top" alt="Product Image"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description}</p>
                                <p className="card-text">{p.type}</p>
                                <p className="card-text"><small className="text-muted">Generations: {p.generations}</small></p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-half text-warning"></i>
                                        <small className="text-muted">(4.5)</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between bg-light">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate(`/pokemon/${p.name.toLowerCase()}`)}
                                >
                                    View Details
                                </button>
                                <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>

    );
};

export default Categories;