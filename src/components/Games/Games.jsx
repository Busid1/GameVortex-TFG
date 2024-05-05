import "./games.css";
import Game from "../Game/Game";
import FrontPage from "../FrontPage/FrontPage";
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";
import { useState } from "react"

export default function Games({ videogames, handleAddToCart, handleRemoveFromCart }) {
    const [alertComingSoon, setAlertComingSoon] = useState(false);
    const handleAlertComingSoon = () => {
        setAlertComingSoon(!alertComingSoon);
    };

    return (
        <section id="home-container" className="d-flex flex-column w-100 align-items-center">

            {
                videogames.map(game => {
                    if (game.id === 1) {
                        return (
                            <FrontPage
                                handleAddToCart={handleAddToCart}
                                handleRemoveFromCart={handleRemoveFromCart}
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                price={game.price}
                                description={game.description}
                                image={game.image}
                                frontPageImage={game.frontPageImage}
                            />
                        )
                    }
                })
            }
            
            <div id="cardGames-container">
                {
                    alertComingSoon ?
                        <div className="alertComingSoon-container">
                            <div>
                                <span className="text-white fs-5">Coming soon :)</span>
                                <hr className="separator" />
                                <button className="btn btn-primary" onClick={handleAlertComingSoon}>Accept</button>
                            </div>
                        </div>
                        : null
                }
                <div className="homeFilter-box">
                    <div className="homeLinks-box">
                        <Link to={HOME_URL} className="homeLink">Home</Link>
                        <Link to="#" onClick={handleAlertComingSoon} className="homeLink noActive">Popular</Link>
                        <Link to="#" onClick={handleAlertComingSoon} className="homeLink noActive">Offers</Link>
                    </div>
                </div>
                <div id="cardGames-box">
                    {
                        videogames.map(game => {
                            if (game.id !== 1) {
                                return (
                                    <Game
                                        handleAddToCart={handleAddToCart}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                        key={game.id}
                                        id={game.id}
                                        title={game.title}
                                        price={game.price}
                                        description={game.description}
                                        image={game.image}
                                        prevGameplay={game.prevGameplay}
                                    />
                                );
                            }
                        })
                    }
                </div>
            </div>
        </section>
    )
}