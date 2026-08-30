import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("ElonMusk12@gmail.com");
  const [password, setPassword] = useState("1234$@Abcd");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true },
      );

      dispatch(addUser(response.data.user));
      dispatch(clearFeed());
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Unable to log in right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );

      if (response.data?.user) {
        dispatch(addUser(response.data.user));
        dispatch(clearFeed());
        navigate("/profile");
      } else {
        setIsLoginForm(true);
        setEmailId("");
        setPassword("");
        setFirstName("");
        setLastName("");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Unable to sign up right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] px-4 py-12 pb-28 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Build your network, one connection at a time.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-base-content/70 sm:text-lg">
            Sign in to discover people, share your work, and keep meaningful
            professional conversations moving.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-base-content/70">
            <span className="badge badge-outline">Meet your community</span>
            <span className="badge badge-outline">Share your journey</span>
          </div>
        </div>

        <div className="card card-border bg-base-100 shadow-xl">
          <form
            className="card-body gap-2"
            onSubmit={isLoginForm ? handleLogin : handleSignUp}
          >
            <div className="mb-4">
              <h2 className="card-title text-2xl">
                {isLoginForm ? "Log in to devConnect" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-base-content/60">
                {isLoginForm
                  ? "Enter your details to continue."
                  : "Fill in the details below to get started."}
              </p>
            </div>

            {errorMessage && (
              <div role="alert" className="alert alert-error mb-2">
                <span>{errorMessage}</span>
              </div>
            )}

            {!isLoginForm && (
              <div className="grid gap-3 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <label className="fieldset-label" htmlFor="firstName">
                    First name <span className="text-error">*</span>
                  </label>
                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      setErrorMessage("");
                    }}
                    type="text"
                    className="input w-full"
                    placeholder="John"
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="fieldset-label" htmlFor="lastName">
                    Last name <span className="text-error">*</span>
                  </label>
                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                      setErrorMessage("");
                    }}
                    type="text"
                    className="input w-full"
                    placeholder="Doe"
                    required
                  />
                </fieldset>
              </div>
            )}

            <fieldset className="fieldset">
              <label className="fieldset-label" htmlFor="email">
                Email address <span className="text-error">*</span>
              </label>
              <input
                value={emailId}
                onChange={(event) => {
                  setEmailId(event.target.value);
                  setErrorMessage("");
                }}
                id="email"
                type="email"
                className={`input w-full ${errorMessage ? "input-error" : ""}`}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <div className="flex items-center justify-between">
                <label className="fieldset-label" htmlFor="password">
                  Password <span className="text-error">*</span>
                </label>
                {isLoginForm && (
                  <button
                    type="button"
                    className="btn btn-link btn-xs p-0 text-primary"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage("");
                }}
                type="password"
                className={`input w-full ${errorMessage ? "input-error" : ""}`}
                placeholder={
                  isLoginForm
                    ? "Enter your password"
                    : "Create a strong password"
                }
                autoComplete={isLoginForm ? "current-password" : "new-password"}
                required
              />
            </fieldset>

            <button
              type="submit"
              className="btn btn-primary mt-4 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {isLoginForm ? "Logging in..." : "Creating account..."}
                </>
              ) : isLoginForm ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </button>

            <div className="divider text-xs text-base-content/50">OR</div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setIsLoginForm((value) => !value);
                setErrorMessage("");
              }}
            >
              {isLoginForm
                ? "New to devConnect? Create an account"
                : "Already have an account? Log in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
