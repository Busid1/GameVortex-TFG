import { useSelector } from "react-redux";
import "./cart.css";
import { useState, useEffect } from "react";
import { removeFromCart } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Payment from "../Payment/Payment";
import PaymentGateway from "../PaymentGateway/PaymentGateway";
import { HOME_URL } from "../../App";
import randomstring from "randomstring";

export default function Cart({ handleRemoveFromCart, inputRef, focusInput }) {
    // State for games in cart and their counts
    const [gamesInCart, setGamesInCart] = useState(useSelector(state => state.gamesInCart));
    const [gameCounts, setGameCounts] = useState({}); // Initially, there are no quantities for any game

    // Access the last array since it will have all the valid card values and thus avoid duplicating elements
    const creditCardData = useSelector(state => state.creditCard.slice(-1)[0]);
    const creditCardErrors = useSelector(state => state.creditCardErrors.slice(-1)[0]);
    const [lastCreditCard, setLastCreditCard] = useState("");

    // Display credit card details if available
    const creditCardComponent = creditCardData ? (
        <div className="creditCardBox">
            <h3>Card holder: {lastCreditCard.cardHolder}</h3>
            <h3>Number: {lastCreditCard.cardNumber}</h3>
            <h3>Expiration: {lastCreditCard.cardExpirationMonth}/{lastCreditCard.cardExpirationYear}</h3>
            <h3>CVC: {lastCreditCard.cardCVC}</h3>
        </div>
    ) : (null);

    useEffect(() => {
        // Get the keys of the gameCounts object
        const keys = Object.keys(gameCounts);

        // Create a new object with keys and values initialized to 1
        const initialGameCounts = Object.fromEntries(keys.map(key => [key, 1]));

        // Set the initialized object to state
        setGameCounts(initialGameCounts);
    }, []);

    const dispatch = useDispatch();
    // Function to increase the count of a game in the cart
    const increaseCount = (gameId) => {
        setGameCounts((prevCounts) => ({
            // Make a copy of the previous counts
            ...prevCounts,
            // If there's nothing for the gameId, initialize it to 0 and add 1
            [gameId]: (prevCounts[gameId] || 1) + 1,
        }));
    };

    // Function to decrease the count of a game in the cart
    const decreaseCount = (gameId) => {
        setGameCounts((prevCounts) => ({
            ...prevCounts,
            // Similar to above, but using Math.max() to prevent negative numbers
            [gameId]: Math.max((prevCounts[gameId] || 1) - 1, 1),
        }));
    };

    // Filter out duplicate games in the cart
    const filterGames = gamesInCart.filter((elem, index, arr) => {
        // Use `findIndex` to find the index of the first element with the same ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Return `true` only if the current index matches the first found index
        return firstIndex === index;
    });

    const filterDelGame = (id) => {
        const newGamesInCart = filterGames.filter(game => game.id !== id)
        setGamesInCart(newGamesInCart);
        handleRemoveFromCart();
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify({ [id]: false }));
        dispatch(removeFromCart(id));
    }

    const gamesAddsInCart = filterGames.map((game) => (
        <div key={game.id} className="cart-box bg-secondary shadow rounded d-flex gap-2">
            <img className="rounded-start" src={game.image} alt={game.title} />
            <div className="d-flex flex-column justify-content-evenly">
                <Link to={`${HOME_URL}/${game.title}`} className="gameTitle text-warning">
                    {game.title}
                </Link>
                <span className="gamePrice">{game.price}</span>
                <div id={game.id} className="d-flex gap-1 align-items-center">
                    <span className="gameAmount">Amount:</span>
                    <span id={game.id} onClick={() => increaseCount(game.id)} className="cartBtns material-symbols-outlined btn btn-dark p-1">
                        add
                    </span>
                    {/* Access the object passed by id, in case there is nothing inside
                        that object, gameCount will be equal to 0 */}
                    <span className="cartBtns" id={game.id}>{gameCounts[game.id] || 1}</span>
                    <span onClick={() => decreaseCount(game.id)} className="cartBtns material-symbols-outlined btn btn-dark p-1">
                        remove
                    </span>
                    <button onClick={() => filterDelGame(game.id)} className="cartBtns material-symbols-outlined btn btn-danger p-1">
                        delete
                    </button>
                </div>
            </div>
        </div>
    ));

    let prices = filterGames.map(game => {
        const roundedPrice = (parseFloat(game.price) * gameCounts[game.id]).toFixed(2);
        return parseFloat(roundedPrice);
    });

    if (prices.length < 1) {
        prices = [0];
    }

    let total = prices.reduce((a, b) => a + b);

    const [isBuyGame, setIsBuyGame] = useState(false);
    const [isSpinner, setIsSpinner] = useState(true);
    const [isBuyGameAlert, setIsBuyGameAlert] = useState(false);

    const spinnerTimeout = () => setTimeout(() => {
        setIsSpinner(false);
    }, 1000);

    const buyGameAlertTimeout = () => {
        setIsBuyGameAlert(!isBuyGameAlert);
    };

    const [closePayment, setClosePayment] = useState(false);
    const handleClosePayment = () => {
        setClosePayment(!closePayment);
    }

    const [isPaymentCorrect, setIsPaymentCorrect] = useState(false);
    const handlePaymentCorrect = () => {
        setIsPaymentCorrect(!isPaymentCorrect);
    }

    const [editPayment, setEditPayment] = useState(false);
    const handleEditPayment = () => {
        if (editPayment) {
            setEditPayment(false);
            setClosePayment(false);
        }
        else {
            setEditPayment(true);
            setClosePayment(true);
        }
    }

    const [addPayment, setAddPayment] = useState(false);
    const handleAddPayment = () => {
        if (addPayment) {
            setAddPayment(true);
            setClosePayment(true);
        }
        else {
            handlePaymentCorrect();
            setAddPayment(false);
            setClosePayment(false);
            setLastCreditCard({ ...creditCardData })
        }
    }

    const [isActivateCode, setIsActivateCode] = useState(false);
    const handleBuyGame = () => {
        let isAnyGame = Object.keys(filterGames).length;
        let isErrors = Object.keys(creditCardErrors).length;

        if (isAnyGame > 0 && isErrors === 0) {
            setIsBuyGame(true);
            spinnerTimeout();
            buyGameAlertTimeout();
            setIsActivateCode(true);
        }
        else {
            setIsBuyGame(false);
        }
    }

    const [creditCardValid, setCreditCardValid] = useState(false);

    //function thats validate if all fields of inputs are correctly
    const isErrors = (obj, errors) => {
        let hasErrors = Object.keys(errors).length;

        for (let el in obj) {
            if (obj[el] === true && hasErrors === 0) {
                setCreditCardValid(true);
                return true;
            }

            else {
                setCreditCardValid(false);
                return false;
            }
        }
    }

    const clearAfterBuyGame = () => {
        // Clear page when you buy game/s
        window.location.replace(HOME_URL);
    };

    return (
        <div className="cart-container text-white pb-4">
            <PaymentGateway
                isPaymentCorrect={creditCardValid}
                isActivateCode={isActivateCode}
            />
            <div className="cartGamesResume-box">
                <div className="cartGamesBox d-flex flex-column">
                    {gamesAddsInCart}
                </div>
                <div className="bg-secondary rounded py-3 resumeGamesBox d-flex flex-column align-items-center">
                    <h2 className="m-0">Resume</h2>

                    <div className="d-flex gap-4 mt-2">
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Game</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div className="resumeGameTitle-box" key={game.id}>
                                            <span>{game.title}</span>
                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Amount</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div key={game.id}>
                                            {
                                                gameCounts[game.id] ?
                                                    (<span>{gameCounts[game.id]}</span>) :
                                                    (<span>{gameCounts[game.id] = 1}</span>)
                                            }

                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Price</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div key={game.id}>
                                            {
                                                gameCounts[game.id] ? (<span>{(parseFloat(game.price) * gameCounts[game.id]).toFixed(2)}$</span>
                                                ) : (<span>{game.price}$</span>)
                                            }
                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <span>Total: {total.toFixed(2)}$</span>
                    {
                        creditCardValid ?
                            <button id="editPayment" onClick={() => { handleEditPayment(); focusInput(); }} className="d-flex align-items-center gap-2 fs-6 btn btn-info shadow mt-3">
                                Edit payment
                                <span className="material-symbols-outlined">
                                    credit_card_gear
                                </span>
                            </button>
                            :
                            <button onClick={() => { handleClosePayment(); focusInput(); }} className="d-flex align-items-center gap-2 fs- btn btn-warning shadow mt-3">
                                Add payment
                                <span className="material-symbols-outlined">
                                    add_card
                                </span>
                            </button>
                    }

                    {lastCreditCard && creditCardData ? creditCardComponent : null}

                    {creditCardValid ? (
                        <div>
                            <button onClick={handleBuyGame} className="d-flex align-items-center gap-2 fs-5 btn btn-success shadow mt-3">
                                Buy game/s
                                <span className="material-symbols-outlined">
                                    payments
                                </span>
                            </button>
                            {isBuyGameAlert ?
                                <div style={{ display: isBuyGame ? "flex" : "none" }} className="activationCode-container">
                                    {isSpinner ?
                                        <span className="spinner"></span>
                                        :
                                        <div className="activationCode-box">
                                            <p className="buyGameMessage">
                                                The purchase was successfully.
                                                <br></br>
                                                The game/s code is below this message:
                                            </p>
                                            <div className="d-flex flex-column gap-2">
                                                {
                                                    filterGames.map(({ title, id }) => (
                                                        <div key={id} className="d-flex justify-content-between gap-3">
                                                            <span className="text-warning" key={id}>{title}</span>
                                                            <span className="text-warning" key={id}>{randomstring.generate({ length: 10, charset: 'alphanumeric' })}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <Link onClick={() => clearAfterBuyGame() } to={HOME_URL} className="d-flex justify-content-center mt-3">
                                                <button className="btn btn-primary">
                                                    Go to home page
                                                </button>
                                            </Link>
                                        </div>
                                    }
                                </div>
                                :
                                (null)
                            }

                        </div>
                    ) : null}

                    {
                        closePayment ? <Payment
                            handlePaymentCorrect={handlePaymentCorrect}
                            handleClosePayment={handleClosePayment}
                            handleAddPayment={handleAddPayment}
                            creditCardData={creditCardData}
                            inputRef={inputRef}
                            isErrors={isErrors}
                        /> :
                            null
                    }
                </div>
            </div>
        </div>
    )
}