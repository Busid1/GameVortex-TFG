import "./game.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, addToFav, removeFromFav } from "../../redux/actions";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function Game({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart }) {
    const location = useLocation();
    const popoverList = useRef();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const [cartAlert, setCartAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);

    useEffect(() => {
        // Verificar si title tiene un valor definido
        if (title) {
            const popover = new bootstrap.Popover(popoverList.current, {
                title: title,
                content: description,
                trigger: "focus"
            });
        }
    }, []);

    // Play and pause the prevGameplay
    const videoRef = useRef(null);
    const handleMouseOver = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {
                console.log("Relax brother");
            });
        }
    };
    const handleMouseOut = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    // State and effect for favorite game
    const [isFavorite, setIsFavorite] = useState(false);
    useEffect(() => {
        const getIsTrue = localStorage.getItem(title);
        const parseIsTrue = JSON.parse(getIsTrue);
        if (parseIsTrue && parseIsTrue[title]) {
            setIsFavorite(true);
        } else {
            setIsFavorite(false);
        }
    }, [title]);

    // State and effect for game in cart
    const [isInCart, setIsInCart] = useState(false);
    useEffect(() => {
        const getIsTrue = localStorage.getItem(id);
        const parseIsTrue = JSON.parse(getIsTrue);
        if (parseIsTrue && parseIsTrue[id]) {
            setIsInCart(true);
        } else {
            setIsInCart(false);
        }
    }, [id]);

    // Function to add game to wishlist (favorites)
    const handleAddToFav = () => {
        localStorage.setItem(title, JSON.stringify({ [title]: true }));
        setIsFavorite(true);
        dispatch(addToFav({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart }));
    };

    // Function to remove game from wishlist (favorites)
    const handleRemoveFromFav = () => {
        handleRemoveFromCart();
        localStorage.removeItem(title);
        setIsFavorite(false);
        dispatch(removeFromFav(id));
    };

    // Function to add game to cart
    const handleTrueCart = () => {
        handleAddToCart();
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        setIsInCart(true);
        dispatch(addToCart({ id, title, price, description, image }));
    };

    // Function to remove game from cart
    const handleFalseCart = () => {
        handleRemoveFromCart();
        localStorage.removeItem(id);
        setIsInCart(false);
        dispatch(removeFromCart(id));
    };

    return (
        <div id="card-item_game" className="card rounded-3 my-3 bg-black d-flex align-items-center border-0">
            <div to={`${HOME_URL}/${title}`} className="navbar-brand text-white card-body">
                <Link to={`${HOME_URL}/${title}`} className="img-games-box">
                    <img className="img-games" src={image} alt={title} />
                    <video ref={videoRef} autoPlay={false} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} playsInline loop muted preload="none" className="prevGameplay" src={prevGameplay}></video>
                </Link>
                {
                    isFavorite ?
                        <button onClick={() => handleRemoveFromFav(title)} id="favoriteFill-btn">
                            <i className="fas fa-heart"></i>
                        </button>
                        :
                        <button onClick={() => handleAddToFav(title)} id="favorite-btn">
                            <span className="material-symbols-outlined">
                                favorite
                            </span>
                        </button>
                }
                <div className="card-body-bottom">
                    <div className="titlePrice-box">
                        <Link className="card-title" to={`${HOME_URL}/${title}`}>
                            {title}
                        </Link>
                        <span ref={changeFocus} className="card-price border border-dark badge bg-danger rounded-pill">{price}</span>
                    </div>

                    {
                        cartAlert ?
                            <div id="addGameCart-alert" className="alert alert-success alert-dismissible p-1" role="alert">
                                <p className="m-0 px-2">The game was added to cart</p>
                            </div>
                            : null
                    }

                    {
                        delAlert ?
                            <div id="delGameCart-alert" className="alert alert-warning alert-dismissible p-1" role="alert">
                                <p className="m-0 px-2">The game was remove from cart</p>
                            </div>
                            : null
                    }
                </div>
            </div>
            <div id="btns-box" className="d-flex w-100 justify-content-evenly">
                <button ref={popoverList} type="button" data-bs-custom-class="custom-popover" id="info-btn" className="btn btn-secondary d-flex align-items-center gap-2" data-container="body">
                    <i className="fas fa-info-circle"></i>
                </button>
                {
                    isInCart ?
                        (
                            <button id="delete-btn" ref={delBtnRef} onClick={() => handleFalseCart(id)} className="btn btn-danger d-flex align-items-center gap-2">
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        )
                        :
                        (
                            <button
                                id="cart-btn"
                                ref={cartBtnRef}
                                onClick={() => handleTrueCart(id)}
                                className="btn btn-warning d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined">
                                    add_shopping_cart
                                </span>
                            </button>
                        )
                }
            </div>
        </div>

    )
}