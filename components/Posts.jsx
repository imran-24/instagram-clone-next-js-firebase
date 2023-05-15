import React, { useEffect, useState } from 'react'
import Post from './Post'
import { onSnapshot, query, orderBy, collection} from '@firebase/firestore'
import { db } from '../firebase';
function Posts() {

  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    // const unsubscribe =  onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
    //     setPosts(snapshot.docs)
    // } )
    // return unsubscribe;
    // or
    return  onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
        setPosts(snapshot.docs)
    } )
    
  }, [db])


  return (
    <div className='w-full '>
        
        {
            posts?.map(post => (
                <Post key={post?.id} id={post?.id} post={post.data()} />
            ))
        }

    </div>
  )
}

export default Posts