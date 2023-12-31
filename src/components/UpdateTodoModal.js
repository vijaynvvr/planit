import React, { Fragment, useState } from "react";
import { createPortal } from "react-dom";
import { TiDeleteOutline } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTodoModal = (props) => {
    const { isOpen, setIsOpen, todo, setMyTodoList } = props;
    if (!isOpen) return null;
    
	const [todoData, setTodoData] = useState({title: todo.title, body: todo.body});
    const onInputChange = (e) => setTodoData(prev => ({...prev, [e.target.name]: e.target.value}))

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
			position: toast.POSITION.TOP_CENTER,
		});
	};
	const onUpdateTodo = async () => {
		if (validateTodos(todoData.title, todoData.body)) {
			try {
				const data = await fetch(
					`${process.env.BACKEND_URL}api/todo/updateTodo/${todo._id}`,
					{
						method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
						body: JSON.stringify({title: todoData.title, body: todoData.body}),
						credentials: "include",
					}
				);
				const jsonData = await data.json();
				if (jsonData.success) {
                    setMyTodoList((prev) =>
                        prev.map((item) =>
                            item._id === jsonData.data._id ? {...item, title: todoData.title, body: todoData.body} : item
                        )
                    );
                    setIsOpen(null);                    
                    success("Todo updated");
				} else {
					warning(jsonData.message || "Internal server error");
				}
			} catch (error) {
				warning("Error: " + error);
			}
		} else {
			warning("Please dont leave empty fields");
		}
	};
	return createPortal(
		<Fragment>
			<div
				className="backdrop fixed w-screen h-screen z-40 bg-black/15"
				onClick={() => setIsOpen(null)}
			></div>
			<div className="modal shadow-xl rounded-xl pt-10 p-4 bg-white fixed z-50 flex flex-col w-10/12 md:w-7/12 lg:w-5/12 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 trans items-center gap-8">
				<TiDeleteOutline
					className="absolute right-1 top-1 text-3xl cursor-pointer hover:text-gray-400"
					onClick={() => setIsOpen(null)}
				/>
				<input
					className="w-full p-2 border-2 border-black focus:rounded-lg"
					type="text"
					name="title"
					value={todoData.title}
					placeholder="Enter the title"
					onChange={onInputChange}
				/>
				<textarea
					className="w-full p-2 border-2 border-black focus:rounded-lg"
					type="text"
					name="body"
					value={todoData.body}
					placeholder="Enter the body"
					onChange={onInputChange}
				/>
				<button
					className="px-4 py-2 hover:rounded-lg border-2 border-black hover:shadow-lg"
					onClick={onUpdateTodo}
				>
					Update
				</button>
			</div>
			<ToastContainer autoClose={1000} />
		</Fragment>,
		document.getElementById("portal")
	);
};

export default UpdateTodoModal;
