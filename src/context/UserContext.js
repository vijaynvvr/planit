import { createContext, useState, useEffect } from "react";

const INIT_USER_INFO = {
    isLoggedIn: true,
    username: "",
    email: "",
    visibility: true,
}

const UserContext = createContext({
	userData: INIT_USER_INFO,
	loginHandler: () => {},
	logoutHandler: () => {},
});

export const UserContextProvider = (props) => {
	const [userData, setUserData] = useState(INIT_USER_INFO);

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
        else {
            setUserData({...INIT_USER_INFO, isLoggedIn: false})
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
		setUserData({...INIT_USER_INFO, isLoggedIn: false});
	};

	const loginHandler = () => {
        fetchUserDetails();
	};

	return (
		<UserContext.Provider
			value={{
				isLoggedIn: userData.isLoggedIn,
                userData: userData,
                setUserData: setUserData,
				loginHandler: loginHandler,
				logoutHandler: logoutHandler
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
