import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Header = () => {
    const {userData, logoutHandler} = useContext(UserContext)
    return (
        <div className='flex justify-between text-2xl'>
            <Link className='font-bold text-3xl' to="/">PlanIT</Link>
            { userData.isLoggedIn ? (
                <div className='flex gap-4 font-medium'>
                    <Link to="/profile">{userData.username}</Link>
                    <Link onClick={logoutHandler} to="/login">Logout</Link>
                </div>
            ) : (
                <div className='flex gap-4 font-medium'>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
            )}
        </div>
    )
}

export default Header;