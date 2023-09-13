import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Post as PostInterface } from "../home";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Comment } from "./comment";

interface Like {
  id: string;
  userId: string;
  postId: string;
}

export interface CommentInterface{
  id: string;
  userId: string;
  username: string;
  postId: string;
  comment: string;
}

interface Props {
  post: PostInterface;
}

export const Post = ({ post }: Props) => {
  const [likesList, setLikesList] = useState<Like[] | null>(null);
  const [commentsList, setCommentsList] = useState<CommentInterface[] | null>(null);
  const [comment, setComment] = useState("");

  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const likesRef = collection(db, "likes");
  const likesDocs = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDocs);
    setLikesList(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
    console.log(likesList);
  };

  const commentsRef = collection(db, "comments");
  const commentsDocs = query(commentsRef, where("postId", "==", post.id));

  const getComments = async () => {
    const data = await getDocs(commentsDocs);
    setCommentsList(
      data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  const addLike = async () => {
    if (user) {
      try {
        const doc = await addDoc(likesRef, {
          postId: post.id,
          userId: user?.uid,
        });
        setLikesList((prev) =>
          prev
            ? [...prev, { id: doc.id, userId: user?.uid, postId: post.id }]
            : [{ id: doc.id, userId: user?.uid, postId: post.id }]
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const removeLike = async () => {
    const likeToDeleteQuery = query(
      likesRef,
      where("userId", "==", user?.uid),
      where("postId", "==", post.id)
    );
    const likeToDeleteData = await getDocs(likeToDeleteQuery);
    const likeToDeleteId = likeToDeleteData.docs[0].id;
    const likeToDelete = doc(db, "likes", likeToDeleteId);
    await deleteDoc(likeToDelete);

    setLikesList(
      (prev) => prev && prev.filter((like) => like.id != likeToDeleteId)
    );
  };

  const addComment = async () => {
    try {
     if (user) {
      const doc = await addDoc(commentsRef, {
        userId: user?.uid,
        username: user?.displayName,
        postId: post.id,
        comment: comment,
      });
  
        setCommentsList((prev: any)=> 
          prev 
          ? [...prev, {id:doc.id, userId: user.uid, username: user.displayName, postId: post.id, comment: comment }]
          : [{id:doc.id, userId: user.uid, username: user.displayName, postId: post.id, comment: comment }]
        )
     }
     else{
      navigate("/login");
     }
    } catch (error) {
      console.log(error);
    }
  };

  const hasUserLiked = likesList?.find((like) => like.userId == user?.uid);

  return (
    <div className="post">
      <h1>{post.title}</h1>
      <h3>{post.description}</h3>

      <div className="like-div">
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        <p>Likes: {likesList?.length}</p>
      </div>

      <p className="username">@{post?.username}</p>

      <div className="addComment">
        <input
          type="text"
          className="commentInput"
          placeholder="comment..."
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="commentBtn" onClick={addComment}>Comment</button>
      </div>

      {commentsList && (
        <div className="comments">
          <h2>Comments</h2>
          {commentsList.map((comment: any) => {
            return <Comment comment={comment} setCommentsList = {setCommentsList} postId = {post.id} />;
          })}
        </div>
      )}
    </div>
  );
};
