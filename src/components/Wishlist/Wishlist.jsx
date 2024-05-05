import { useSelector } from "react-redux";
import Game from "../Game/Game";
import "./wishlist.css"
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function Wishlist({ handleAddToCart, handleRemoveFromCart }) {
    const reduxfavorites = useSelector(state => state.favGames);
    const favorites = reduxfavorites.filter((elem, index, arr) => {
        // Use `findIndex` to find the index of the first element with the same ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Return `true` only if the current index matches the first found index
        return firstIndex === index;
    });

    return (
        <section className="wishlist-container">
            <div className="homeFilter-box">
                <div className="homeLinks-box">
                    <Link to={`${HOME_URL}/wishlist`} title="wishlist" className="homeLink">Wishlist</Link>
                    <Link to={HOME_URL} title="home" className="homeLink noActive">Home</Link>
                </div>
            </div>
            <div className="wishlist-box">
                {
                    favorites.map(game => {
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
                        )

                    })
                }
            </div>
        </section>
    )
}