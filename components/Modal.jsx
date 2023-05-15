import React, {useRef, useState} from 'react'
import {Snapshot, useRecoilState} from 'recoil'
import {modalState} from '../atoms/modalAtom'
import {VscChromeClose} from 'react-icons/vsc'
import {IoArrowBackOutline} from 'react-icons/io5'
import {db, storage} from '../firebase';
import {addDoc, collection, serverTimestamp, updateDoc, doc} from '@firebase/firestore'
import {ref, getDownloadURL, uploadString} from '@firebase/storage'
import {useSession} from 'next-auth/react';
import { async } from '@firebase/util'


function Modal({setActive}) {
 
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null)
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const {data: session} = useSession();
  const uploadPost = async () => {
    if(loading) return;

    setLoading(true);
    // 1) Create a post and add to firebase 'posts' collection
    // 2) get the post ID for the newly created post
    // 3) uplaod the image to the firebase storage with the post ID
    // 4) get the download URL from the FB storage and update the original post 

    const docRef = await addDoc(collection(db, 'posts'),{
        username: session.user.username,
        caption: captionRef.current.value,
        profileImg: session.user.image,
        timestamp: serverTimestamp()
    })
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, 'data_url').then( async Snapshot => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id),{
            image: downloadURL
        })
    });

    setOpen(false);
    setSelectedFile(null);
    setLoading(false);

  } 
 const addImageToPost = (e) => {
    const reader = new FileReader();
    if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result)
    }
  }
  return (
   
        
        <>
        {
            open && (
                <div class="fixed duration-200 ease-out transition-all w-full h-full bg-black bg-opacity-50 flex items-center justify-center top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
                    <VscChromeClose onClick={() =>{ 
                        setOpen(false)
                        setSelectedFile(null)
                        setActive({home: true})
                        }} fontSize={26} className='fixed right-4 top-2 text-white cursor-pointer' />
                    <div class="relative w-[40rem]  h-[40rem] bg-white rounded-xl shadow-lg">
                        <div className='h-12 w-full border-b flex items-center justify-between px-4'>
                            <button disabled={!selectedFile} className='disabled:cursor-not-allowed  cursor-pointer hover:opacity-80' onClick={() =>  setSelectedFile(null) }><IoArrowBackOutline  fontSize={26} className='' /></button>
                            <p className='font-semibold text-lg '>Create new post</p>
                            <button disabled={!selectedFile} onClick={uploadPost} type='button' className='font-semibold text-center text-sky-600 hover:bg-opacity-80 rounded-lg cursor-pointer disabled:cursor-default disabled:opacity-0' >Upload post</button>
                            
                        </div>
                        {
                            selectedFile ? 
                            (<div className='w-full h-full grid grid-cols-2 justify-between p-2  '>
                                <img className='w-[300px]' src={selectedFile} />
                                <textarea ref={captionRef} rows={6} cols={20}  type="text" className='border-none resize-none p-2 w-full h-1/2  rounded-md outline-none placeholder:text-light font-light' placeholder='Please enter a caption'></textarea>
                               
                            </div>) :
                            (<div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                                <img src="https://cdn-icons-png.flaticon.com/128/3342/3342137.png" alt="" className='w-28' />
                                <p className='text-2xl font-extralight'>Drag photos and videos here</p>
                                <input type="file" hidden ref={filePickerRef} onChange={addImageToPost} />
                                <button onClick={()=> filePickerRef.current.click()} type='button' className='text-white font-semibold text-center bg-sky-600 hover:bg-opacity-80 rounded-lg py-2 px-6' >Select from computer</button>
                            </div>)
                        }
                        
                    </div>
                </div>
            )
        }
        
        </>
        
    
  )
}

export default Modal