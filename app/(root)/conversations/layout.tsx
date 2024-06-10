'use client'
import React from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import loading from '@/public/loading.svg'

const layout = ({ children }: { children: React.ReactNode }) => {

  const conversations = useQuery(api.conversation.getFriends);
  const router = useRouter();
  const showConversation = (id: any) => {
    router.push(`/conversations/${id}`);
  }

  return (
    <section className='flex w-full'>
      <div className='h-[95vh] m-3 border border-gray-300 rounded-md flex flex-col p-2 '>
        <div className='flex justify-between'>
          <h2 className='self-start p-1 text-xl'>Conversations</h2>
          <PlusCircleOutlined />
        </div>
        <div className='flex flex-col gap-3 '>
          {
            conversations?.map((item, index) => {
              
              return (
                <div className='flex flex-col border border-gray-300 rounded-md gap-2 p-2 cursor-pointer' key={item._id}>
                  <div className='flex  items-center cursor-pointer' key={item?._id}
                    onClick={() => { showConversation(item?.conversationId) }}>
                    <Image src={`${item?.imageUrl|| loading}`} alt='user image' width={30} height={30} className='rounded-full object-contain' />
                    <div className='flex flex-col '>
                      <span className='text-base'>{item?.username}</span>
                      <span className='text-sm opacity-75'>{item?.email}</span>
                    </div>
                  </div>
                  <span className='text-sm opacity-75 truncate max-w-40'>{item?.lastMessage}</span>

                </div>
              )
            })
          }
        </div>

      </div>
      <div className='flex-1'>
        {children}

      </div>
    </section>
  )
}

export default layout