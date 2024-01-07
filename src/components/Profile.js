import React, { Fragment, useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "./ProfileCard";
import { TiDeleteOutline, TiEdit, TiTickOutline, TiTick } from "react-icons/ti";
import Loader from "./Loader";
import UpdateTodoModal from "./UpdateTodoModal";

const Profile = () => {
	const { userData, setUserData } = useContext(UserContext);
	// if (!isLoggedIn) return <Navigate to="/login"/>
	// if (!isLoggedIn) navigate('/login');
	const [isLoading, setIsLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(null);

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
		setIsLoading(false);
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

	const updateStatus = async (id) => {
		try {
			const response = await fetch(
				`${process.env.BACKEND_URL}api/todo/updateTodoStatus/${id}`,
				{
					method: "PUT",
					credentials: "include",
				}
			);
			const jsonData = await response.json();
			if (jsonData.success) {
				setMyTodoList((prev) =>
					prev.map((todo) =>
						todo._id == id
							? { ...todo, status: !todo.status }
							: todo
					)
				);
				success("Status changed");
			} else {
				warning(jsonData.message || "Failed to update status");
			}
		} catch (error) {
			warning("Error: " + error);
		}
	};

	const changeUserVisibility = async (status) => {
		try {
			const response = await fetch(
				`${process.env.BACKEND_URL}api/auth/updateVisibility/${userData.email}`,
				{
					method: "PUT",
                    headers: { "Content-Type": "application/json" },
					body: JSON.stringify({status: status}),
					credentials: "include",
				}
			);
			const jsonData = await response.json();
			if (jsonData.success) {
				setUserData((prev) => ({ ...prev, visibility: status }));
				success("Status changed");
			} else {
				warning(jsonData.message || "Failed to update status");
			}
		} catch (error) {
			warning("Error: " + error);
		}
	};

	return (
		<Fragment>
			<form
				className="flex flex-col sm:w-10/12 md:w-9/12 lg:w-7/12 mx-auto my-12 items-center gap-4"
				onSubmit={addTodos}
			>
				{/* <h1 className="text-4xl font-bold">Plan yo day</h1> */}
				<ProfileCard
					// className="w-full"
					icon={userData.username[0]?.toUpperCase()}
					name={userData.username}
					email={userData.email}
				/>
				<div className="px-1 py-1 border-2 border-gray-500 flex shadow-6xl rounded-full">
					{/* explicitly mentioning type:button so that it doesn't trigger submit functionility (it is inside form) */}
                    <button
						type="button"
						className={`rounded-full px-4 py-2 ${!userData.visibility && 'border-2 bg-gray-200 border-gray-500'}`}
                        onClick={() => changeUserVisibility(false)}
					>
						Private
					</button>
					<button
						type="button"
						className={`rounded-full px-4 py-2 ${userData.visibility && 'border-2 bg-gray-200  border-gray-500'}`}
                        onClick={() => changeUserVisibility(true)}
					>
						Public
					</button>
				</div>
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
					Add
				</button>
			</form>
			<ul className="flex flex-col sm:w-10/12 md:w-9/12 lg:w-7/12 mx-auto my-12 gap-4">
				{myTodoList.length ? (
					isLoading ? (
						<Loader className="mt-2" />
					) : (
						myTodoList.map((todo) => {
							return (
								<li
									key={todo._id}
									className="flex gap-2 justify-between items-center shadow-md hover:shadow-lg rounded-lg p-2"
								>
									<div>
										<h1 className="font-bold text-xl break-all">
											{todo.title}
										</h1>
										<p className="text-lg break-all">
											{todo.body}
										</p>
									</div>
									<span className="flex text-3xl gap-2">
										{todo.status ? (
											<TiTick
												className="cursor-pointer hover:text-gray-400"
												onClick={() =>
													updateStatus(todo._id)
												}
											/>
										) : (
											<TiTickOutline
												className="cursor-pointer hover:text-gray-400"
												onClick={() =>
													updateStatus(todo._id)
												}
											/>
										)}
										<TiEdit
											className="cursor-pointer hover:text-gray-400"
											onClick={() => setIsOpen(todo._id)}
										/>
										{isOpen == todo._id && (
											<UpdateTodoModal
												isOpen={isOpen}
												setIsOpen={setIsOpen}
												todo={todo}
												setMyTodoList={setMyTodoList}
											/>
										)}
										<TiDeleteOutline
											className="cursor-pointer hover:text-gray-400"
											onClick={() => deleteTodo(todo._id)}
										/>
									</span>
								</li>
							);
						})
					)
				) : (
					<h1 className="text-center text-2xl my-6">
						No plannings yet
					</h1>
				)}
			</ul>
			<ToastContainer autoClose={1000} />
		</Fragment>
	);
};

export default Profile;
