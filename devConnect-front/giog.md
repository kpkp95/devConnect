import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.user));
      dispatch(clearFeed());
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      if (res.data?.user) {
        dispatch(addUser(res.data.user));
      }
      setIsLoginForm(true);
      setError("");
      setEmailId("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="my-10 flex justify-center px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl ring-1 ring-base-300">
        <div className="card-body gap-4">
          <div className="mb-2 text-center">
            <div className="badge badge-primary badge-outline mb-3 px-3 py-3 text-xs uppercase tracking-[0.2em]">
              devConnect
            </div>
            <h2 className="card-title justify-center text-2xl">
              {isLoginForm ? "Login" : "Sign Up"}
            </h2>
          </div>

          {!isLoginForm && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="form-control w-full">
                <span className="label-text mb-1">
                  First Name <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">
                  Last Name <span className="text-error">*</span>
                </span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          )}

          <label className="form-control w-full">
            <span className="label-text mb-1">
              Email ID <span className="text-error">*</span>
            </span>
            <input
              type="email"
              value={emailId}
              className="input input-bordered w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1">
              Password <span className="text-error">*</span>
            </span>
            <input
              type="password"
              value={password}
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            className="btn btn-primary mt-2"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Login" : "Create account"}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setIsLoginForm((value) => !value);
              setError("");
            }}
          >
            {isLoginForm
              ? "New User? Sign up here"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
