import React, { Fragment, useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
// import { useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "./ProfileCard";
import { TiDeleteOutline } from "react-icons/ti";
import Loader from "./Loader";

const Profile = () => {
	const { username, email } = useContext(UserContext);
	// if (!isLoggedIn) return <Navigate to="/login"/>
	// if (!isLoggedIn) navigate('/login');
	const [isLoading, setIsLoading] = useState(true);

	const INITIAL_USERINFO = {
		title: "",
		body: "",
	};
	const [todos, setTodos] = useState(INITIAL_USERINFO);

	const [myTodoList, setMyTodoList] = useState([]);

	useEffect(() => {
		const fetchMyTodos = async () => {
			const data = await fetch(
				process.env.BACKEND_URL + "api/todo/getTodos",
				{
					credentials: "include",
				}
			);
			const todoJson = await data.json();
			setMyTodoList(todoJson.data);
		};
		fetchMyTodos();
		// setIsLoading(false);
	}, []);

	const validateTodos = (title, body) => {
		if (title && body) return true;
		else return false;
	};

	const warning = (msg) => {
		toast.warning(msg, {
			position: toast.POSITION.BOTTOM_CENTER,
		});
	};

	const success = (msg) => {
		toast.success(msg, {
			position: toast.POSITION.BOTTOM_CENTER,
		});
	};

	const onInputChange = (event) => {
		setTodos((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const addTodos = async (event) => {
		event.preventDefault();
		if (validateTodos(todos.title, todos.body)) {
			const data = await fetch(
				`${process.env.BACKEND_URL}api/todo/createTodo`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(todos),
					credentials: "include", // to include cookies and headers
				}
			);
			const jsonData = await data.json();
			if (jsonData.success) {
				setTodos(INITIAL_USERINFO);
				success("Todo added");
				setMyTodoList((prev) => [...prev, jsonData.data]);
			} else {
				warning(jsonData.message);
			}
		} else {
			warning("Please fill all fields");
		}
	};

	const deleteTodo = async (id) => {
		try {
			const response = await fetch(
				`${process.env.BACKEND_URL}api/todo/deleteTodo/${id}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			const jsonData = await response.json();
			if (jsonData.success) {
				setMyTodoList((prev) => prev.filter((todo) => todo._id !== id));
				success("Todo deleted");
			} else {
				warning(jsonData.message || "Failed to delete todo");
			}
		} catch (error) {
			console.error("Error deleting todo:", error);
			warning("Failed to delete todo");
		}
	};

	return (
		<Fragment>
			<form
				className="flex flex-col sm:w-10/12 md:w-9/12 lg:w-7/12 mx-auto my-12 items-center gap-8"
				onSubmit={addTodos}
			>
				<h1 className="text-4xl font-bold">Plan yo day</h1>
				<ProfileCard
					className="w-full"
					icon={username[0].toUpperCase()}
					name={username}
					email={email}
				/>
				<input
					className="w-full p-2 border-2 border-black focus:rounded-lg"
					type="text"
					name="title"
					value={todos.title}
					placeholder="Enter the title"
					onChange={onInputChange}
				/>
				<textarea
					className="w-full p-2 border-2 border-black focus:rounded-lg"
					type="text"
					name="body"
					value={todos.body}
					placeholder="Enter the body"
					onChange={onInputChange}
				/>
				<button className="px-4 py-2 hover:rounded-lg border-2 border-black hover:shadow-lg">
					Add it
				</button>
			</form>
			<ul className="flex flex-col sm:w-10/12 md:w-9/12 lg:w-7/12 mx-auto my-12 gap-4 px-2">
				{myTodoList.length ? (
                    isLoading ? (
                        <Loader className="mt-2" />
                    ) : (
                        myTodoList.map((todo) => {
                            return (
                                <li
                                    key={todo._id}
                                    className="flex justify-between items-center shadow-lg rounded-lg p-2"
                                >
                                    <div>
                                        <h1 className="font-bold text-xl">
                                            {todo.title}
                                        </h1>
                                        <p className="text-lg">{todo.body}</p>
                                    </div>
                                    <span
                                        className="text-4xl hover:text-gray-400 cursor-pointer"
                                        onClick={() => deleteTodo(todo._id)}
                                    >
                                        <TiDeleteOutline />
                                    </span>
                                </li>
                            );
                        })
                    )
                ) : (
                    <h1 className="text-center text-2xl my-6">No plannings yet</h1>
                )}
			</ul>
			<ToastContainer autoClose={1000} />
		</Fragment>
	);
};

export default Profile;
