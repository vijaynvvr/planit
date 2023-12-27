import React, { Fragment, useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
// import { useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "./ProfileCard";

const Profile = () => {
	const {username, email} = useContext(UserContext);
	// if (!isLoggedIn) return <Navigate to="/login"/>
	// if (!isLoggedIn) navigate('/login');
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
				process.env.BACKEND_URL + "api/todo/createTodo",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(todos),
					credentials: "include", // to include cookies and headers
				}
			);
			const jsonData = await data.json();
			if (jsonData.success) {
				setTodos(INITIAL_USERINFO);
				success("Todos added");
                setMyTodoList(prev => [...prev, jsonData.data]);
			} else {
				warning(jsonData.message);
			}
		} else {
			warning("Please fill all fields");
		}
	};

	return (
		<Fragment>
			<form
				className="flex flex-col w-6/12 mx-auto my-12 items-center gap-8"
				onSubmit={addTodos}
			>
                <ProfileCard icon={username[0].toUpperCase()} name={username} email={email}/>
				<h1 className="text-2xl">Plan yo day</h1>
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
			<ul className="flex flex-col w-6/12 mx-auto my-12 gap-4">
				{myTodoList?.map((todo) => {
					return (
						<li key={todo._id} className="flex flex-col gap-2">
							<h1>{todo.title}</h1>
							<p>{todo.body}</p>
						</li>
					);
				})}
			</ul>
			<ToastContainer autoClose={1000} />
		</Fragment>
	);
};

export default Profile;
