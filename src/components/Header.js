import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Header = () => {
    const {isLoggedIn, username, logoutHandler} = useContext(UserContext)
    return (
        <div className='flex justify-between text-xl'>
            <Link to="/">PlanIt</Link>
            { isLoggedIn ? (
                <div className='flex gap-4'>
                    <Link to="/profile">{username}</Link>
                    <Link onClick={logoutHandler} to="/login">Logout</Link>
                </div>
            ) : (
                <div className='flex gap-4'>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
            )}
        </div>
    )
}

export default Header;