import { Link } from "react-router";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import axios from "axios";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(removeUser());
      dispatch(clearFeed());
      navigate("/login");
    } catch (error) {
      // logout failure is already handled by the UI state
    }
  };

  return (
    <div>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link
            to={user ? "/feed" : "/login"}
            className="btn btn-ghost text-xl"
          >
            🤝devConnect
          </Link>
        </div>
        {user && (
          <div className="flex gap-2">
            <div className="dropdown dropdown-end mx-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS Navbar component" src={user.photo} />
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="justify-between">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="justify-between">
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
