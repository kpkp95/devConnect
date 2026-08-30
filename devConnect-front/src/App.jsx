import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import axios from "axios";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useDispatch, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import { API_BASE_URL } from "./utils/constants";
import { addUser, removeUser } from "./utils/userSlice";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const ProtectedPage = ({ children, isAuthReady }) => {
  const user = useSelector((state) => state.user);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (user) {
        setIsAuthReady(true);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/profile/view`, {
          withCredentials: true,
        });

        if (isMounted) {
          dispatch(addUser(response.data));
        }
      } catch (error) {
        if (isMounted) {
          dispatch(removeUser());
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/feed" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/feed" replace /> : <Login />}
        />
        <Route
          path="/feed"
          element={
            <ProtectedPage isAuthReady={isAuthReady}>
              <Feed />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPage isAuthReady={isAuthReady}>
              <Profile />
            </ProtectedPage>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedPage isAuthReady={isAuthReady}>
              <Connections />
            </ProtectedPage>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedPage isAuthReady={isAuthReady}>
              <Requests />
            </ProtectedPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={appStore}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
