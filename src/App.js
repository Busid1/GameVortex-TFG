import Games from './components/Games/Games';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useState, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import axios from "axios";
import GameDetails from './components/GameDetails/GameDetails';
import Cart from './components/Cart/Cart';
import Wishlist from './components/Wishlist/Wishlist';
export const HOME_URL = "/GameVortex-TFG";
export const API_URL = `https://gamevortex.glitch.me/gamevortex`;
import './App.css';

function App() {
  const [videogames, setVideogames] = useState([]);
  const [searchGame, setSearchGame] = useState([]);
  const location = useLocation();

  // Create a reference
  const inputRef = useRef(null);
  // Function to focus the input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  useEffect(() => {
    async function gamesData() {
      try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        setVideogames(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    // When the component is mounted the function 'allGames()' will be executed
    gamesData();

  }, []);

  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  }

  const handleRemoveFromCart = () => {
    if (cartCount < 1) {
      setCartCount(0);
    }
    else {
      setCartCount(cartCount - 1);
    }
  }

  const onSearch = (title) => {
    axios(`${API_URL}/${title}`)
      .then(response => {
        setSearchGame(response.data[0]);
      })

      .catch(err => {
        console.log(err);
      })
  }

  const handleIsTrue = (gameId) => {
    const getIsTrue = localStorage.getItem(gameId);
    const parseIstrue = JSON.parse(getIsTrue);
    return parseIstrue && parseIstrue[gameId];
  }

  return (
    <div>
      {
        location.pathname !== `${HOME_URL}/cart` ?
          <Header cartCount={cartCount} onSearch={onSearch} videogames={videogames} handleRemoveFromCart={handleRemoveFromCart} searchGame={searchGame} />
          :
          (null)
      }
      <Routes>
        <Route path={HOME_URL} element={<Games handleIsTrue={handleIsTrue} videogames={videogames} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />}></Route>
        <Route path={`${HOME_URL}/:game`} element={<GameDetails handleIsTrue={handleIsTrue} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} videogames={videogames} />} />
        <Route path={`${HOME_URL}/wishlist`} element={<Wishlist handleIsTrue={handleIsTrue} />} />
        <Route path={`${HOME_URL}/cart`} element={<Cart handleRemoveFromCart={handleRemoveFromCart} inputRef={inputRef} focusInput={focusInput} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;