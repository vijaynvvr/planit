import { createContext, useState, useEffect } from "react";

const UserContext = createContext({
	isLoggedIn: false,
    username: "",
    email: "",
	loginHandler: () => {},
	logoutHandler: () => {},
});

export const UserContextProvider = (props) => {
	const [userData, setUserData] = useState({
        isLoggedIn: false,
        username: "",
        email: ""
    });

    const fetchUserDetails = async () => {
        const data = await fetch(
            process.env.BACKEND_URL + "api/auth/fetchUser",
            {
                credentials: "include",
            }
        );
        const userInfo = await data.json();
        if (userInfo.success) {
            setUserData({
                isLoggedIn: true,
                username: userInfo.data.name,
                email: userInfo.data.email
            });
        }
    };

	useEffect(() => {
		fetchUserDetails();
	}, []);

	const logoutHandler = async () => {
		await fetch(process.env.BACKEND_URL + "api/auth/logout",
            {
                credentials: "include",
            }
        );
		setUserData({
            isLoggedIn: false,
            username: "",
            email: ""
        });
	};

	const loginHandler = () => {
        fetchUserDetails();
	};

	return (
		<UserContext.Provider
			value={{
				isLoggedIn: userData.isLoggedIn,
                username: userData.username,
                email: userData.email,
				loginHandler: loginHandler,
				logoutHandler: logoutHandler,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
