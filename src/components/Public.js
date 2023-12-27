import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../context/UserContext";

const Public = () => {
	const { isLoggedIn } = useContext(UserContext);
    return (
        !isLoggedIn ? <Outlet /> : <Navigate to="/profile"/>
    );
};

export default Public;
