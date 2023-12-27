import React, { useContext, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../context/UserContext";

const LoginForm = () => {
    const {isLoggedIn, loginHandler} = useContext(UserContext);
    // if (isLoggedIn) return <Navigate to="/profile"/>
	const navigate = useNavigate();
    // if (isLoggedIn) navigate("/profile");


	const validateContactInfo = (email, password) => {
		if (email && password) return true;
		else return false;
	};

	const warning = (msg) => {
		toast.warning(msg, {
			position: toast.POSITION.BOTTOM_CENTER,
		});
	};

	const INITIAL_USERINFO = {
		email: "",
		password: "",
	};

	const [userInfo, setUserInfo] = useState(INITIAL_USERINFO);

	const onInputChange = (event) => {
		setUserInfo((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const onLogin = async (event) => {
		event.preventDefault();
		if (validateContactInfo(userInfo.email, userInfo.password)) {
			const data = await fetch(
				process.env.BACKEND_URL + "api/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userInfo),
                    credentials: "include", // to include cookies and headers
				}
			);
			const jsonData = await data.json();
            if (jsonData.success) {
                setUserInfo(INITIAL_USERINFO);
                loginHandler();
                navigate('/profile')
            }
            else {
                warning(jsonData.message);
            }
		} else {
			warning("Please fill all details");
		}
	};

	return (
		<form
			className="flex flex-col w-6/12 mx-auto my-24 items-center gap-8"
			onSubmit={onLogin}
		>
			<h1 className="text-2xl">Login Form</h1>
			<input
				className="p-2 border-2 border-black"
				type="email"
				name="email"
				value={userInfo.email}
				onChange={onInputChange}
				placeholder="Enter your email"
			/>
			<input
				className="p-2 border-2 border-black"
				type="password"
				name="password"
				value={userInfo.password}
				onChange={onInputChange}
				placeholder="Enter your password"
			/>
			<button className="px-4 py-2 rounded-lg border-2 border-black hover:shadow-lg">
				Login
			</button>
			<p className="tracking-widest text-gray-600">
				New user?{" "}
				<Link
					className="hover:text-black hover:drop-shadow-xl"
					to="/signup"
				>
					Signup Now
				</Link>
			</p>
			<ToastContainer autoClose={1000} />
		</form>
	);
};

export default LoginForm;
