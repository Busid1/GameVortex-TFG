import "./frontpage.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function FrontPage({ id, title, price, description, image, frontPageImage, handleAddToCart, handleRemoveFromCart }) {
    const location = useLocation();
    const popoverList = useRef();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const [cartAlert, setCartAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);

    useEffect(() => {
        const popover = new bootstrap.Popover(popoverList.current, {
            title: title,
            content: description,
            trigger: "focus"
        })
    }, []);

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
        <div className="frontPage-container">
            <Link to={`${HOME_URL}/${title}`} className="frontPageImage-box d-flex align-items-center justify-content-end">
                <img src={frontPageImage} alt={title} />
            </Link>
            <div className="card-body-main d-flex flex-column justify-content-center align-items-start">
                <div className="navbar-brand text-white">
                    <div className="d-flex flex-column">
                        <Link to={`${HOME_URL}/${title}`} className="card-title-main text-warning">
                            {title}
                        </Link>
                        <span ref={changeFocus} className="frontPageCard-price">{price}</span>
                    </div>
                    <div id="frontPageBtns-box" className="d-flex w-100 gap-3">
                        <button type="button" ref={popoverList} data-bs-custom-class="custom-popover" id="info-btn" className="btn btn-secondary d-flex align-items-center gap-2" data-container="body">
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
                                    <button id="cart-btn" ref={cartBtnRef} onClick={() => handleTrueCart(id)} className="btn btn-warning d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined">
                                            add_shopping_cart
                                        </span>
                                    </button>
                                )
                        }
                    </div>
                </div>
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
    )
}