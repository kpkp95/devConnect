import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const fetchUser = async () => {
    if (userData) return userData;
    try {
      const user = await axios.get(`${API_BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(user.data));
      return user.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dispatch, userData]);
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
