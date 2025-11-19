import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {

    const authStatus = useSelector((state) => state.auth.status)

    const navigate = useNavigate();

    // Navigation items with conditional active status based on authentication.If user is authenticated, show "All Posts" and "Add Post", else show "Login" and "Signup"
    const navItems = [
        {
            name: 'Home',
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        },
    ]

    return (
        <header className="py-3 shadow bg-gray-500">
            <Container>
                <nav className="flex">
                    <div className="mr-4">
                        <link to="/">
                            <Logo width="70px" />
                        </link>
                    </div>
                    // Navigation menu: renders only active navigation items as buttons that navigate to their respective slugs(location) on click
                    <ul className="flex ml-auto">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        // If user is authenticated, show the Logout button
                        // Render LogoutBtn component inside a list item
                        // Only render if authStatus is true
                        //This syntax is called short-circuit evaluation, which means that if authStatus is true, the LogoutBtn component will be rendered; otherwise, nothing will be rendered.
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header