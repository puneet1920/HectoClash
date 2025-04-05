import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <img src={user.picture} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;