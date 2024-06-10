'use client'
import React from 'react'
import ConversationCard from '@/components/ConversationCard'
import { UserAddOutlined } from '@ant-design/icons'
import Image from 'next/image'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
const page = () => {

  const [friendEmail, setFrientEmail] = React.useState('');
  const sendRequest = useMutation(api.request.create);
  const router =useRouter();

  const reject = useMutation(api.request.rejectRequest);
  const accept = useMutation(api.request.acceptRequest)

  const friendRequestsReceived = useQuery(api.request.getFrindRequest);


  const addFriend = async () => {
    try {
      sendRequest({ email: friendEmail });

    } catch (err) {
      console.log(err);
    }
  }

  const rejectRequest = async (rejectUserId: any)=>{
    reject({rejectUserId: rejectUserId})
  }

  const acceptRequest = async (acceptUserId: any)=>{
    accept({friendId: acceptUserId});
    router.push('conversations')
  }

  return (
    <section className='flex'>
      <div className='h-[95vh] m-3 border border-gray-300 rounded-md flex flex-col p-2 '>
        <div className='flex justify-between'>
          <h2 className='self-start p-1 text-xl'>Friends</h2>



          <AlertDialog>
            <AlertDialogTrigger asChild>
              <UserAddOutlined onClick={() => { }} />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Adding friend by their email addresss</AlertDialogTitle>

                <input value={friendEmail} placeholder='Enter Email' onChange={(e) => { setFrientEmail(e.target.value) }}
                  className='border border-gray-300 my-5' />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={addFriend}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className='flex flex-col gap-3'>
          <ConversationCard />
          {
            friendRequestsReceived?.map((item, index) => {
              return (
                <div className='flex border border-gray-300 rounded-md gap-2 p-2 items-center' key={item?._id}>
                  <Image src={`${item?.imageUrl}`} alt='user image' width={30} height={30}  className='rounded-full object-contain'/>
                  <div className='flex flex-col '>
                    <span className='text-base'>{item?.username}</span>
                    <span className='text-sm opacity-75'>{item?.email}</span>
                  </div>

                  <div className='flex ml-auto gap-3'>
                  <CheckOutlined className='bg-green-500 p-2 rounded-md cursor-pointer' onClick={()=>{acceptRequest(item?._id)}}/>
                  <CloseOutlined className='bg-red-500 p-2 rounded-md cursor-pointer' onClick={()=>{rejectRequest(item?._id)}}/>
                  </div>

                  

                </div>
              )
            })
          }

        </div>

      </div>
    </section>
  )
}

export default page