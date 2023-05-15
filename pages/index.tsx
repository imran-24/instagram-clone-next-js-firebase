import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Feed from '../components/Feed'
import Modal from '../components/Modal'
import {useSession} from 'next-auth/react'






const index = (data: {data: string}) => {
  console.log(data)
  const {data: session} = useSession();
  const [active, setActive] = useState({
    home: true,
})
  

 
  return (
    <div className="max:w-screen  h-screen flex  relative">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {
        session && (
          <>
            {/* Header */}
            <Header />
            

            {/* Sidebar */}
              <Sidebar active={active} setActive={setActive} />
      
            {/* Feed */}
            <Feed />
             
            {/* Modal  */}
            <Modal setActive={setActive}  />
      
            {/* Footer */}
              <Footer />
          </>
        )
      }
    </div>
  )
}

export default index

export async function getStaticProps() {
  
  return {props: {data: 'test'}}
}