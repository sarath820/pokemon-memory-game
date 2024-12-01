import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [clickTrue, setClickTrue] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch Pokémon list
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=50")
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results))
      .catch((err) => console.log(err));
  }, []);

  // Fetch Pokémon details and shuffle
  useEffect(() => {
    const fetchData = async () => {
      const promises = pokemonList.map((pokemon) =>
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((data) => ({
            name: pokemon.name,
            imageUrl: data.sprites.other.home.front_default,
            clicked: false,
          }))
          .catch((err) => console.log(err))
      );

      const results = await Promise.all(promises);
      const shuffledResults = [...results].sort(() => 0.5 - Math.random()).slice(0, 20);
      setPokemonData(shuffledResults);
    };

    if (pokemonList.length > 0) {
      fetchData();
    }
  }, [pokemonList]);

  function shuffleArray(picData, event) {
    if (clickTrue) return;

    const clickedName = event.target.getAttribute("data-name");
    let gameOver = false;

    const updatedData = picData.map((pokemon) => {
      if (pokemon.name === clickedName) {
        if (pokemon.clicked) {
          setClickTrue(true);
          gameOver = true;
        } else {
          setScore((prevScore) => prevScore + 1);
        }
        return { ...pokemon, clicked: true };
      }
      return pokemon;
    });

    if (!gameOver) {
      const shuffledData = [...updatedData]
        .filter((pokemon, index, self) =>
          self.findIndex((p) => p.name === pokemon.name) === index
        )
        .sort(() => 0.5 - Math.random());
      setPokemonData(shuffledData);
    } else {
      setPokemonData(updatedData);
    }
  }

  function resetGame() {
    setClickTrue(false);
    setScore(0);

    const resetData = pokemonData.map((pokemon) => ({ ...pokemon, clicked: false }));
    const shuffledData = [...resetData].sort(() => 0.5 - Math.random());
    setPokemonData(shuffledData);
  }

  return (
    <div className={`app-container ${clickTrue ? 'blurred' : ''}`}>
      <div className="navbar">
        <p>Pokemon-game</p>
        <p>Score: {score}</p>
      </div>

      {clickTrue && (
        <div className="game-over">
          Your game is over <br />
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="pokemon-container">
        {pokemonData.map((pokemon) => (
          <div key={`${pokemon.name}-${pokemon.clicked}`} className="pokemoncard">
            {pokemon.imageUrl && (
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                data-name={pokemon.name}
                onClick={(event) => shuffleArray([...pokemonData], event)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
