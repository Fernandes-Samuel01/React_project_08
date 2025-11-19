import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();
    //logout handler: calls the auth service logout method and then dispatches the logout action to update the redux store
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        });
    }
    return (
        <button className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
            onClick={logoutHandler}
        >
            Logout
        </button>
    )
}

export default LogoutBtn;