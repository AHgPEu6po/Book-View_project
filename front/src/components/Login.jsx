import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {

    const { backendUrl, setShowLogin, setToken, getUserData } = useContext(AppContext);

    const [currentState, setCurrentState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {

            const endpoint =
                currentState === "login"
                    ? "/api/user/login"
                    : "/api/user/register";

            const payload =
                currentState === "login"
                    ? { email, password }
                    : { name, email, password };

            const res = await axios.post( backendUrl + endpoint, payload );

            if (res.data.success) {

                localStorage.setItem("token", res.data.token);
                setToken?.(res.data.token);

                toast.success(
                    currentState === "login"
                        ? "Login successful"
                        : "Account created"
                );

                setShowLogin(false);
                getUserData?.();

            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div
            onClick={() => setShowLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50"
        >

            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 w-80 sm:w-[352px] p-8 py-12 rounded-lg shadow-xl
                    border border-gray-200 bg-white text-gray-500"
            >

                <p className="text-2xl font-medium text-center">
                    <span className="text-primary">
                        User
                    </span>{" "}
                    {currentState === "login" ? "Login" : "Sign Up"}
                </p>

                {currentState === "register" && (
                    <div className="w-full">

                        <p>Name</p>

                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary-dull"
                        />
                    </div>
                )}

                <div className="w-full">

                    <p>Email</p>

                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary-dull"
                    />

                </div>

                <div className="w-full">

                    <p>Password</p>

                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-200 rounded  w-full p-2 mt-1 outline-primary-dull"
                    />

                </div>

                {currentState === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span onClick={() => setCurrentState("login")} className="text-primary cursor-pointer">
                            click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span onClick={() => setCurrentState("register")} className="text-primary cursor-pointer">
                            click here
                        </span>
                    </p>
                )}

                <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
                >
                    {currentState === "register"
                        ? "Create Account"
                        : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;