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

interface Props {
  post: PostInterface;
}

interface Like {
  id: string;
  userId: string;
  postId: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  postId: string;
  comment: string;
}

export const Post = ({ post }: Props) => {
  const [likesList, setLikesList] = useState<Like[] | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[] | null>(null);

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

      <div className="comments">
        {commentsList &&
          commentsList.map((comment) => {
            return (
              <div className="comment">
                <p>{comment.comment}</p>
                <p>{comment.username}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
