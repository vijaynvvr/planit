import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "./ProfileCard";

const UserProfile = () => {
	const [myTodoList, setMyTodoList] = useState([]);
    const [userData, setUserData] = useState({
        icon: "",
        name: "",
        email: ""
    })
    const { id } = useParams();

	useEffect(() => {
        const fetchMyTodos = async () => {
        	const [todosResponse, userDataResponse] = await Promise.all([
                fetch(process.env.BACKEND_URL + "api/todo/getTodos/" + id, { credentials: "include" }),
                fetch(process.env.BACKEND_URL + "api/auth/fetchUser/" + id)
            ]);

            const [todoJson, jsonUserData] = await Promise.all([
                todosResponse.json(),
                userDataResponse.json()
            ]);
            setMyTodoList(todoJson.data);
            setUserData({
                icon: jsonUserData.data.name[0].toUpperCase(),
                name: jsonUserData.data.name,
                email: jsonUserData.data.email
            });
        };
		fetchMyTodos();
	}, []);

	return (
        <div className="flex flex-col w-6/12 mx-auto my-12 gap-4">
            <ProfileCard icon={userData.icon} name={userData.name} email={userData.email}/>
            {myTodoList.length? (
                myTodoList?.map((todo) => {
                    return (
                        <div key={todo._id} className="flex flex-col gap-2">
                            <h1>{todo.title}</h1>
                            <p>{todo.body}</p>
                        </div>
                    );
                })
            ) : (
                <h1>No plannings yet</h1>
            )}
        </div>
	);
};

export default UserProfile;
