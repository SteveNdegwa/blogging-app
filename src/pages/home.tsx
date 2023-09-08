import { getDocs, collection } from "firebase/firestore"
import { db } from "../config/firebase"
import { useEffect, useState } from "react";
import { Post } from "../components/post";

export interface Post{
    userId: string;
    username: string;
    title: string;
    description: string;
    id: string;
}

export const Home = () =>{

    const [postsList, setPostsList] = useState<Post[] | null>(null);

    const postsRef = collection(db, "posts");

    const getPosts = async()=>{
        const postsData = await getDocs(postsRef);
        setPostsList(postsData.docs.map((doc: any)=> ({...doc.data(), id: doc.id})));
    }

   useEffect(()=>{
    getPosts();
   },[])

    return (
        <div className="homepage">
            {!postsList && <h1 className="loading">Loading...</h1>}
            {postsList && postsList.map((post)=>{
                return <Post post= {post} />
            })}
        </div>
    )
}