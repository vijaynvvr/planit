import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../context/UserContext";

const Private = () => {
	const { userData } = useContext(UserContext);
    return (
        userData.isLoggedIn ? <Outlet /> : <Navigate to="/login" />
    );
};

export default Private;
