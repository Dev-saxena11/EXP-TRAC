import React from 'react'
import { navbarStyles } from '../assets/dummyStyles.js'
import img1 from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
const Navbar = ({user:propUser,onLogout}) => {
    const navigate=useNavigate(); 
    const user = propUser||{
        name:"",
        email:"",
    };
  return (
    <header className={navbarStyles.header}>
        <div className={navbarStyles.container}>
            {/* logo */}
            <div onClick={()=>navigate("/")} 
            className={navbarStyles.logoContainer}>

                <div className={navbarStyles.logoImage}>
                    <img src={img1} alt="logo" />
                </div>
                <span className={navbarStyles.logoText}>
                    Expense Tracker
                </span>
            </div>
            {/* if user is present */}
            {user && (
                <div className
            )}
        </div>
    </header>
  );
};

export default Navbar;