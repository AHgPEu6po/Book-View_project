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

    useEffect(() => {

        const localToken = localStorage.getItem("token");

        if (localToken) {

            setToken(localToken);

            getUserData(localToken);
        }

    }, []);

    const value = {
        backendUrl, navigate, token, setToken, userData, setUserData,
        showLogin, setShowLogin, login, register, logout, getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;