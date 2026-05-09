import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Verify = () => {

  const { backendUrl, token, setCartItems } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");

  const verifyPayment = async () => {

    try {
      const orderIds = JSON.parse(localStorage.getItem("orderIds"));

      const response = await axios.post( backendUrl + "/api/order/verify",
        { success, orderIds }, { headers: { token }});

      if (response.data.success) {

        setCartItems({});
        localStorage.removeItem("orderIds");
        navigate("/tickets");

      } else {
        navigate("/cart");
      }

    } catch (error) {
      console.log(error);
      navigate("/cart");
    }
  };

  useEffect(() => {
    if (token) {verifyPayment()}
  }, [token]);

  return (
    <div className="p-10 text-center">
      Перевірка оплати...
    </div>
  );
};

export default Verify;