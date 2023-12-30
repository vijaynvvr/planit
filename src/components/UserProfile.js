import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "./ProfileCard";
import Loader from "./Loader";

const UserProfile = () => {
	const [myTodoList, setMyTodoList] = useState([]);
	const [userData, setUserData] = useState({
		icon: "",
		name: "",
		email: "",
	});
	const [isLoading, setIsLoading] = useState(true);

	const { id } = useParams();

	useEffect(() => {
		const fetchMyTodos = async () => {
			const [todosResponse, userDataResponse] = await Promise.all([
				fetch(process.env.BACKEND_URL + "api/todo/getTodos/" + id, {
					credentials: "include",
				}),
				fetch(process.env.BACKEND_URL + "api/auth/fetchUser/" + id),
			]);

			const [todoJson, jsonUserData] = await Promise.all([
				todosResponse.json(),
				userDataResponse.json(),
			]);
			setMyTodoList(todoJson.data);
			setUserData({
				icon: jsonUserData.data.name[0].toUpperCase(),
				name: jsonUserData.data.name,
				email: jsonUserData.data.email,
			});
		};
		fetchMyTodos();
		setIsLoading(false);
	}, []);

	return (
		<div className="flex flex-col sm:w-10/12 md:w-9/12 lg:w-7/12 mx-auto my-12 gap-4 px-2">
			<ProfileCard
				icon={userData.icon}
				name={userData.name}
				email={userData.email}
			/>
			{myTodoList.length ? (
				isLoading ? (
					<Loader className="mt-14" />
				) : (
					myTodoList.map((todo) => {
						return (
							<div key={todo._id} className="flex flex-col gap-2 shadow-lg rounded-lg p-2">
								<h1 className="font-bold text-xl">
									{todo.title}
								</h1>
								<p className="text-lg">{todo.body}</p>
							</div>
						);
					})
				)
			) : (
				<h1 className="text-center text-2xl my-12">No plannings yet</h1>
			)}
		</div>
	);
};

export default UserProfile;
