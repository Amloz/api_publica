import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeList, setTypeList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      setPokemonList(response.data.results);
      setFilteredPokemon(response.data.results); // Inicialmente mostramos todos los Pokémon
    };

    const fetchTypes = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/type/');
      setTypeList(response.data.results);
    };

    fetchPokemon();
    fetchTypes();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = async (event) => {
    const typeUrl = event.target.value;
    setSelectedType(typeUrl);

    if (!typeUrl) {
      setFilteredPokemon(pokemonList);
      return;
    }

    const response = await axios.get(typeUrl);
    const typeFilteredPokemon = response.data.pokemon.map((p) => p.pokemon.name);

    setFilteredPokemon(
      pokemonList.filter((pokemon) => typeFilteredPokemon.includes(pokemon.name))
    );
  };

  const fetchPokemonDetails = async (pokemon) => {
    const response = await axios.get(pokemon.url);
    setSelectedPokemon(response.data);
  };

  const displayedPokemon = filteredPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <div className="left-column">
        <h1>Pokédex</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar Pokémon"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="type-filter">
          <select value={selectedType} onChange={handleTypeChange}>
            <option value="">Todos los tipos</option>
            {typeList.map((type) => (
              <option key={type.name} value={type.url}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <ul className="pokemon-list">
          {displayedPokemon.map((pokemon) => (
            <li key={pokemon.name} onClick={() => fetchPokemonDetails(pokemon)}>
              {pokemon.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-column">
        {selectedPokemon ? (
          <div className="pokemon-details">
            <h2>{selectedPokemon.name}</h2>
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
              className="pokemon-image"
            />
            <p>Altura: {selectedPokemon.height / 10} m</p>
            <p>Peso: {selectedPokemon.weight / 10} kg</p>
            <p>
              Tipos:{' '}
              {selectedPokemon.types.map((type) => (
                <span key={type.type.name}>{type.type.name} </span>
              ))}
            </p>
          </div>
        ) : (
          <p className="placeholder">Selecciona un Pokémon para ver sus detalles</p>
        )}
      </div>
    </div>
  );
}

export default App;
