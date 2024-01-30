import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Profile from "./components/Profile";
import Error from "./components/Error";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import Private from "./components/Private";
import Public from "./components/Public";
import UserProfile from "./components/UserProfile";
import { inject } from '@vercel/analytics';
inject();
import {config} from 'dotenv';
config();

const App = () => {
    return (
        <UserContextProvider>
            <div className="md:w-8/12 h-screen mx-auto p-4">
                <Header />
                <Outlet />
            </div>
        </UserContextProvider>
    )
}

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Hero />
            },
            {
                path: "/login",
                element: <Public />,
                children: [
                    {
                        path: "/login",
                        element: <LoginForm />
                    },
                ]
            },
            {
                path: "/signup",
                element: <Public />,
                children: [
                    {
                        path: "/signup",
                        element: <SignupForm />
                    },
                ]
            },
            {
                path: "/profile",
                element: <Private />,
                children: [
                    {
                        path: "/profile/",
                        element: <Profile />
                    },
                ]
            },
            {
                path: "/users/:id",
                element: <Private />,
                children: [
                    {
                        path: "/users/:id/",
                        element: <UserProfile />
                    },
                ]
            },
        ],
        errorElement: <Error />
    }
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter}></RouterProvider>);
