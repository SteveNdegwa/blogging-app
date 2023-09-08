import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
}

export const PostForm = () => {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    title: yup.string().required("Please enter the title"),
    description: yup.string().required("Please enter the description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");

  const onSubmitPost = async (data: FormData) => {
   if(user){
    await addDoc(postsRef, {
        ...data,
        username: user?.displayName,
        userId: user?.uid,
      });
      navigate("/");
   }else{
    navigate("/login")
   }
  };

  return (
    <form className="postForm" onSubmit={handleSubmit(onSubmitPost)}>
      <input className="textInput" placeholder="Title..." {...register("title")} />
      <textarea className="textInput" placeholder="Description..." {...register("description")} />
      <p style={{ color: "red" }}>
        {errors.title ? errors.title.message : errors.description?.message}
      </p>
      <input className="submitPostButton" type="submit" />
    </form>
  );
};
