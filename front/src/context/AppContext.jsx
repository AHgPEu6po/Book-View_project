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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);

        const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const months = [
            "січня","лютого","березня","квітня","травня","червня",
            "липня","серпня","вересня","жовтня","листопада","грудня"
        ];

        return `${date.getDate()} ${
            months[date.getMonth()]
        }, ${days[date.getDay()]}`
    };

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: "#C4C7D2",
            borderRadius: "15px",
            boxShadow: "none",
            "&:hover": { borderColor: "none" }
        }),

        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#E5E7EB",
            borderRadius: "8px",
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#6B7280"
        }),

        multiValueRemove: (provided) => ({
            ...provided,
            borderRadius: "8px",
            cursor: "pointer",
            padding: "2px",
            "&:hover": {
                backgroundColor: "#E8A7AF",
                color: "#111827"
            }
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#800020"
                : state.isFocused
                ? "#E8A7AF"
                : "white",
            color: state.isSelected ? "white" : "#111827",
            cursor: "pointer",
        }),
    };

    const value = {
        backendUrl, navigate, token, setToken, userData, setUserData,
        showLogin, setShowLogin, logout, getUserData,
        cartItems, setCartItems, addToCart, deleteFromCart, getUserCart,
        getCartAmount, customSelectStyles, formatDate
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;