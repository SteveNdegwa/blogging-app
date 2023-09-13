import { CommentInterface } from "./post"
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteDoc, doc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Props {
  comment: CommentInterface;
  setCommentsList: any;
}

export const Comment = ({ comment, setCommentsList}: Props) => {
    const [user] = useAuthState(auth);

    const navigate = useNavigate();

    const deleteComment = async()=>{
      if(user){
        try {

            const commentToDelete = doc(db, "comments", comment.id)
            await deleteDoc(commentToDelete);

            setCommentsList((prev: CommentInterface[] | null)=> prev && prev.filter((comment2: CommentInterface) => comment2.id != comment.id))

          } catch (error) {
           console.log(error);
          }
      }else{
        navigate("/login")
      }
    }

  return (
    <div className="comment">
      <p className="username">@{comment.username} - </p>
      <p className="comment">{comment.comment}</p>
      {(comment.userId == user?.uid) && <button className="deleteComment" onClick={deleteComment}>Delete</button>}
    </div>
  );
};
