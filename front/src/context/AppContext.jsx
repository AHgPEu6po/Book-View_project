import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [userData, setUserData] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [cartItems, setCartItems] = useState({});

    const login = async (email, password) => {
        try {

            const response = await axios.post(
                backendUrl + "/api/user/login",
                {
                    email,
                    password,
                }
            );

            if (response.data.success) {

                setToken(response.data.token);

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                toast.success("Успішний вхід");
                await getUserData(response.data.token);
                await getUserCart(response.data.token);
                setShowLogin(false);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const register = async (name, email, password) => {
        try {

            const response = await axios.post(
                backendUrl + "/api/user/register",
                {
                    name,
                    email,
                    password,
                }
            );

            if (response.data.success) {

                setToken(response.data.token);

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                toast.success("Акаунт створено");
                await getUserData(response.data.token);
                await getUserCart(response.data.token);
                setShowLogin(false);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUserData(null);
        setCartItems({});
        toast.success("Ви вийшли з акаунту");
        navigate("/");
    };

    const getUserData = async (currentToken = token) => {
        try {

            const response = await axios.get(
                backendUrl + "/api/user/me",
                {
                    headers: {
                        token: currentToken,
                    },
                }
            );

            if (response.data.success) {

                setUserData(response.data.user);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const addToCart = async (sessionId, seat) => {

        let cartData = structuredClone(cartItems);

        if (!cartData[sessionId]) {
            cartData[sessionId] = [];
        }

        const exists = cartData[sessionId].some(
            (s) =>
                s.row === seat.row &&
                s.number === seat.number
        );

        if (exists) {
            toast.error("Місце вже у кошику");
            return;
        }

        cartData[sessionId].push(seat);

        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(
                    backendUrl + "/api/cart/add",
                    {
                        sessionId,
                        seat,
                    },
                    {
                        headers: {
                            token,
                        },
                    }
                );

                toast.success("Місце додано у кошик");

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const deleteFromCart = async (sessionId, seat) => {

        let cartData = structuredClone(cartItems);

        if (!cartData[sessionId]) return;

        cartData[sessionId] = cartData[sessionId].filter(
            (s) =>
                !(
                    s.row === seat.row &&
                    s.number === seat.number
                )
        );

        if (cartData[sessionId].length === 0) {
            delete cartData[sessionId];
        }

        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(
                    backendUrl + "/api/cart/delete",
                    {
                        sessionId,
                        seat,
                    },
                    {
                        headers: {
                            token,
                        },
                    }
                );

                toast.success("Місце видалено");

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getUserCart = async (currentToken = token) => {
        try {

            const response = await axios.post(
                backendUrl + "/api/cart/get",
                {},
                {
                    headers: {
                        token: currentToken,
                    },
                }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getCartAmount = () => {

        let totalAmount = 0;

        for (const sessionId in cartItems) {
            for (const seat of cartItems[sessionId]) {
                totalAmount += seat.price || 0;
            }
        }
        return totalAmount;
    };

    useEffect(() => {

        const localToken = localStorage.getItem("token");

        if (localToken) {
            setToken(localToken);
            getUserData(localToken);
            getUserCart(localToken);
        }
    }, []);

    const value = {
        backendUrl, navigate, token, setToken, userData, setUserData,
        showLogin, setShowLogin, login, register, logout, getUserData,
        cartItems, setCartItems, addToCart, deleteFromCart, getUserCart,
        getCartAmount,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;