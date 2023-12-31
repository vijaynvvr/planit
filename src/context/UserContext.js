import { createContext, useState, useEffect } from "react";

const UserContext = createContext({
	isLoggedIn: false,
    username: "",
    email: "",
    visibility: true,
	loginHandler: () => {},
	logoutHandler: () => {},
});

export const UserContextProvider = (props) => {
	const [userData, setUserData] = useState({
        isLoggedIn: false,
        username: "",
        email: "",
        visibility: true
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
                email: userInfo.data.email,
                visibility: userInfo.data.visibility
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
            email: "",
            visibility: true
        });
	};

	const loginHandler = () => {
        fetchUserDetails();
	};

	return (
		<UserContext.Provider
			value={{
                userData: userData,
				isLoggedIn: userData.isLoggedIn,
                username: userData.username,
                email: userData.email,
                visibility: userData.visibility,
				loginHandler: loginHandler,
				logoutHandler: logoutHandler,
                setUserData: setUserData
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
