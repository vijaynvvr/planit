import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../context/UserContext";

const Public = () => {
	const { userData } = useContext(UserContext);
    return (
        !userData.isLoggedIn ? <Outlet /> : <Navigate to="/profile"/>
    );
};

export default Public;
