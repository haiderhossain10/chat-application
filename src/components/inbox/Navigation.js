import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/lws-logo-dark.svg";
import { userLoggedOut } from "../../features/auth/authSlice";

export default function Navigation() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(userLoggedOut());
        localStorage.clear();
    };
    return (
        <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/">
                        <img
                            className="h-10"
                            src={logoImage}
                            alt="Learn with Sumit"
                        />
                    </Link>
                    <ul className="flex items-center gap-3">
                        <li className="text-white font-bold">
                            Hi, {user.name}
                        </li>
                        <li>
                            <span
                                className="cursor-pointer bg-red-200 py-2 px-3 rounded hover:bg-red-700 hover:text-red-200 duration-200 block text-red-700 text-sm"
                                onClick={logout}
                            >
                                Logout
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
