import React, { useEffect, useState } from 'react'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiFillHeart} from 'react-icons/ai'
import {FiMessageCircle} from 'react-icons/fi'
import {HiOutlinePaperAirplane} from 'react-icons/hi'
import {FiBookmark} from 'react-icons/fi'
import {MdOutlineMoreHoriz} from 'react-icons/md'
import {HiOutlineEmojiHappy} from 'react-icons/hi'
import {addDoc, collection, serverTimestamp, orderBy, onSnapshot, query, setDoc, doc, deleteDoc,  } from '@firebase/firestore';
import { db } from '../firebase';
import {useSession} from 'next-auth/react';
import Moment from 'react-moment'


function Post({id, post}) {

  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const {data: session} = useSession();
  const sendComment = async (e) => {
    e.preventDefault();
    const sentComment = comment;
    setComment('');
    await addDoc(collection(db ,'posts' ,id , 'comments'),{
        comment: sentComment,
        username: session.user.username,
        userImage: session.user.image,
        timestamp: serverTimestamp()
    })
  }
    useEffect(() =>  onSnapshot(collection(db, 'posts', id, 'likes'), snapshot => {
                    setLikes(snapshot.docs)} )

    ,[db, id])

    useEffect(() => 
                    setHasLiked(
                        likes.findIndex((like) => like.id === session?.user?.uid) != -1) 
                    ,[likes])

    
  useEffect(() =>  onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), snapshot => {
                   setComments(snapshot.docs)} )

  ,[db])

  

  const likePost = async (e) => {
    if (hasLiked) await deleteDoc(doc(db, 'posts', id, 'likes', session?.user?.uid))
    else{
        await setDoc(doc(db, 'posts', id, 'likes', session.user.uid ), {
            username: session.user.username
        })
    }
  } 
  return (
    <div className='w-full border flex flex-col gap-2 border-gray-300 rounded-md pt-3 mb-4'>
        <div className='flex  justify-between items-center px-3'>
            <div className='flex gap-4 '>
            <img className='h-10 w-10 rounded-full' src={post?.profileImg} alt="" />
            <p className='font-medium'>{post?.username}</p>
            </div>
            <div>
            <MdOutlineMoreHoriz fontSize={26} />
            </div>
        </div>
        
        <div>

        </div>
        <div>
            <img className='w-full' src={post?.image} alt="" />
        </div>
        <div className='flex items-center px-3 justify-between'>
            <div className='flex items-center gap-3'>
                <div onClick={likePost} >
                    {
                        hasLiked ? <AiFillHeart className='btnIcon  cursor-pointer text-red-500' fontSize={27} />
                        : <AiOutlineHeart className='btnIcon  cursor-pointer ' fontSize={27} />
                    }
                </div>
                <FiMessageCircle className='hover:opacity-50 cursor-pointer rotate-[275deg]' fontSize={27} />
                <HiOutlinePaperAirplane className='hover:opacity-50 ml-1 cursor-pointer rotate-45' fontSize={25} />
            </div>
            <div>
                <FiBookmark fontSize={27} />
            </div>
        </div>
        <div className='px-4'>
            <p className='font-medium'>{likes?.length} {likes?.length > 1 ? 'likes' : 'like'}</p>
        </div>
        <div className='px-4'>
            <p>
                <span className='font-medium mr-2'>{post?.username}</span>
                {post?.caption}
            </p>
        </div>
        {
            comments.length > 0 && comments?.map(comment => (
                <div className='px-8 py-1  flex gap-2 item-center '>
                <img className='h-7 w-7 rounded-full' src={comment.data().userImage} alt="" />
                <p className='w-full px-1 text-lg border-none outline-none' readOnly ><span className='font-semibold text-sm hover:opacity-70 cursor-pointer mr-2'>{comment.data().username}</span>{comment.data().comment}</p>
                <Moment className='text-xs w-28 m-auto' fromNow>{comment.data().timestamp?.toDate()}</Moment>
                </div>
            ))
        }
        <div className='px-3 py-4  border-t  flex items-center'>
            <HiOutlineEmojiHappy fontSize={27} />
            <input type="text" value={comment} className='w-full px-1 border-none outline-none' onChange={(e)=> setComment(e.target.value)}  placeholder='Add a comment...'  />
            <button onClick={sendComment} className='font-semibold text-sm  text-sky-500 disabled:opacity-0' disabled={!comment?.trim()} type='submit'>Post</button>
        </div>
        

    </div>
  )
}

export default Post