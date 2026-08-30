import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Body } from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/feed" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />

        <Route element={<Body />}>
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
        </Route>
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
