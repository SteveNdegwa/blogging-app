import { auth, provider } from "../config/firebase"
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export const Login = () =>{

    const navigate = useNavigate();

    const userSignUp = async() =>{
        await signInWithPopup(auth, provider);
        navigate("/")
    }
    return (
        <div className="loginPage">
            <h1>Sign Up with Google to continue</h1>
            <button className="signUpButton" onClick={userSignUp}>Sign Up with Google</button> 
        </div>
    )
}