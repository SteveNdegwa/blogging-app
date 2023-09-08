import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const Navbar = () => {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const userSignOut = async() =>{
    await signOut(auth);
    navigate("/login")
  }

  return (
    <div className="navbar">
      <div className="links">
        {user && <Link className="link" to="/">Home</Link>}
        <Link className="link" to= {user ? "/create-post": "/login"}>{user? <>Create Post</> : <>Login</>}</Link>
      </div>
      {user && (
        <div className="userDetails">
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""} />
            <button className="signOutButton" onClick={userSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};
