import { useState } from "react";
import axios from "axios";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload =
      mode === "register"
        ? { email, password, username }
        : { username, password };

    setError("");
    try {
      const endpoint = `${process.env.REACT_APP_API_BASE_URL}/${mode}`;
      const res = await axios.post(endpoint, payload);
      onLogin(res.data.user_id, res.data.email, res.data.username);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl min-w-[380px] px-6 mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {recoveryMode
            ? "Reset Your Password"
            : mode === "login"
            ? "Login to Your Tracker"
            : "Create Your Account"}
        </h2>

        <form
          onSubmit={
            recoveryMode
              ? (e) => {
                  e.preventDefault();
                  setError("");
                  axios
                    .post(
                      `${process.env.REACT_APP_API_BASE_URL}/reset-password`,
                      {
                        email: recoveryEmail,
                        new_password: newPassword,
                      }
                    )
                    .then((res) => {
                      setResetMessage(res.data.message);
                    })
                    .catch((err) => {
                      setError(err.response?.data?.detail || "Recovery failed");
                    });
                }
              : handleSubmit
          }
          className="bg-white p-8 rounded-lg shadow space-y-6 flex flex-col w-full"
        >
          {!recoveryMode && (
            <div>
              <input
                className="border p-3 w-full rounded"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {recoveryMode ? (
            <div>
              <input
                className="border p-3 w-full rounded"
                placeholder="Enter your registered email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
            </div>
          ) : (
            mode === "register" && (
              <div>
                <input
                  className="border p-3 w-full rounded"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border p-3 w-full rounded"
              placeholder={recoveryMode ? "New Password" : "Password"}
              value={recoveryMode ? newPassword : password}
              onChange={(e) =>
                recoveryMode
                  ? setNewPassword(e.target.value)
                  : setPassword(e.target.value)
              }
            />
            {!recoveryMode && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-sm text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            {recoveryMode
              ? "Reset Password"
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>

          {resetMessage && (
            <div className="text-green-600 text-center">{resetMessage}</div>
          )}

          {error && (
            <div className="text-red-600 text-center">
              {typeof error === "string" ? error : error.msg}
            </div>
          )}

          <div className="text-sm flex flex-col space-y-2 mt-2 text-center">
            {!recoveryMode ? (
              <>
                <span>
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-blue-600 underline ml-1"
                  >
                    {mode === "login" ? "Register" : "Login"}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => setRecoveryMode(true)}
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setRecoveryMode(false);
                  setRecoveryEmail("");
                  setNewPassword("");
                  setResetMessage("");
                }}
                className="text-blue-600 underline hover:text-blue-800 transition"
              >
                Back to Login/Register
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}