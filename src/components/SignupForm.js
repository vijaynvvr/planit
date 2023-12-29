import React, { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../context/UserContext";

const SignupForm = () => {
    // const {isLoggedIn} = useContext(UserContext);
    // if (isLoggedIn) return <Navigate to="/profile"/>
	const navigate = useNavigate();
    // if (isLoggedIn) navigate("/profile");

    const validateContactInfo = (email, password) => {
        if (email && password)
          return true;
        else return false;
    };

    const warning = (msg) => {
        toast.warning(msg, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    };
    
	const INITIAL_USERINFO = {
		name: "",
		email: "",
		password: "",
	};
	const [userInfo, setUserInfo] = useState(INITIAL_USERINFO);

	const onInputChange = (event) => {
		setUserInfo((prev) => ({...prev,[event.target.name]: event.target.value}));
	};

	const onSignup = async (event) => {
        event.preventDefault();
        if (validateContactInfo(userInfo.name, userInfo.email, userInfo.password)) {
            const data = await fetch(
				process.env.BACKEND_URL + "api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userInfo)
                }
            );
            const jsonData = await data.json();
            if (jsonData.success) {
                setUserInfo(INITIAL_USERINFO);
                navigate("/login")
            }
            else {
                warning(jsonData.message);
            }
        }
        else {
            warning("Please fill all details");
        }
	};
	return (
		<form
			className="flex flex-col md:w-7/12 mx-auto my-24 items-center gap-8"
			onSubmit={onSignup}
		>
			<h1 className="text-4xl">Signup Form</h1>
			<input
				className="p-2 border-2 border-black"
				type="text"
				placeholder="Enter your name"
                name="name"
				value={userInfo.name}
				onChange={onInputChange}
                />
			<input
				className="p-2 border-2 border-black"
				type="email"
				placeholder="Enter your email"
                name="email"
				value={userInfo.email}
				onChange={onInputChange}
                />
			<input
				className="p-2 border-2 border-black"
				type="password"
				placeholder="Enter your password"
                name="password"
				value={userInfo.password}
				onChange={onInputChange}
                />
			<button className="px-4 py-2 rounded-lg border-2 border-black hover:shadow-lg">
				Signup
			</button>
			<p className="tracking-widest text-gray-600 text-center">
				Already registered?{" "}
				<Link
					className="hover:text-black hover:drop-shadow-xl"
					to="/login"
				>
					Login Now
				</Link>
			</p>
            <ToastContainer autoClose={1000} />
		</form>
	);
};

export default SignupForm;
