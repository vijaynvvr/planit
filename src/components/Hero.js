import React, { useState } from "react";
import { Link } from 'react-router-dom';
import ProfileCard from "./ProfileCard";

const Hero = () => {
    const [query, setQuery] = useState('');
    const [userData, setUserData] = useState([])
    const onQuerySubmit = (event) => {
        event.preventDefault();
        fetchUsersData(query);
    }
    const fetchUsersData = async (query) => {
        const data = await fetch(
            process.env.BACKEND_URL + "api/auth/getUsers/" + query,
        );
        const jsonData = await data.json();
        setUserData(jsonData.data);
    }
	return (
		<div className="flex flex-col mx-auto my-24 items-center gap-8">
			<h1 className="text-4xl font-bold">PlanIt</h1>
			<p className="text-xl italic tracking-widest text-center">
				Plan your day, and look at others' plans
			</p>
            <div className="flex flex-col items-center gap-4">
                <form onSubmit={onQuerySubmit}>
                    <input
                        className="p-2 border-2 border-black rounded-l-lg"
                        type="text"
                        placeholder="Search for users..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button type="submit" className="p-2 border-l-0 border-2 border-black rounded-r-lg hover:shadow-lg">
                        Search
                    </button>
                </form>
                <div className="flex gap-4">
                    <button className="px-4 py-2 rounded-lg border-2 border-black hover:shadow-lg" onClick={() => fetchUsersData("")}>Show All Users</button>
                    <button className="px-4 py-2 rounded-lg border-2 border-black hover:shadow-lg" onClick={() => setUserData([])}>Clear</button>
                </div>
            </div>
			<ul className="flex flex-col gap-4">
                {userData && userData.map(user => {
                    return (
                        <Link to={"/users/" + user._id} key={user._id}>
                            <ProfileCard icon={user.name[0].toUpperCase()} name={user.name} email={user.email}/>
                        </Link>
                    );
                })}
			</ul>
		</div>
	);
};

export default Hero;
