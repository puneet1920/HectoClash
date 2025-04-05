import { useAuth0 } from "@auth0/auth0-react";

const AuthPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome to Our App</h1>
        <div className="auth-buttons">
          <button 
            className="auth-button login-btn"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
          <button 
            className="auth-button signup-btn"
            onClick={() => loginWithRedirect({ screen_hint: "signup" })}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;