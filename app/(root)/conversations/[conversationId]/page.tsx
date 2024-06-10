'use client'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import React from 'react'
import Image from 'next/image'
import Loading from '@/public/loading.svg'
import { AudioOutlined, VideoCameraOutlined, DeleteOutlined } from '@ant-design/icons'
import Link from 'next/link'

const page = ({ params }: { params: { conversationId: any } }) => {


    const [message, setMessage] = React.useState<any>('');
    const [file, setFile]= React.useState<any>(null);
    const [preview, setPreview] = React.useState<any>(null);


    const sendMessage = useMutation(api.message.sendMessage)
    const getMessages = useQuery(api.message.getMessage, { conversationId: params.conversationId, pageOfMessage: 1 });

    const friendInfo = useQuery(api.user.getFriend, { conversationId: params.conversationId })
    const userInfo = useQuery(api.user.getUserInfo);


    const messageDeliver = () => {
        setMessage('');
        sendMessage({ conversationId: params.conversationId, content: message });
    }
    console.log(file);

    const selectFile = (e:any)=>{
        const imageFile = e.target.files[0];
        if(imageFile){
            setFile(imageFile)
            setPreview(URL.createObjectURL(imageFile))
        }
    }

    return (
        <main className='h-[95vh] m-3 border border-gray-300 rounded-md flex flex-col p-2'>
            <div className='flex flex-row justify-between items-center rounded-md border border-gray-300'>
                <div className='flex items-center cursor-pointer' >
                    <Image src={friendInfo?.imageUrl || Loading} alt='user image' width={30} height={30} className='rounded-full object-contain' />
                    <div className='flex flex-col '>
                        <span className='text-base'>{friendInfo?.username}</span>
                        <span className='text-sm opacity-75'>{friendInfo?.email}</span>
                    </div>
                </div>
                <div className='flex gap-5 h-fit text-xl mr-5'>
                    <Link href='https://moom-3-um.vercel.app/'> <VideoCameraOutlined /></Link>
                    <Link href='https://moom-3-um.vercel.app/'><AudioOutlined /></Link>
                    <DeleteOutlined className='bg-red-600 rounded-md' />

                </div>

            </div>

            <section className='flex flex-col my-5 overflow-scroll overflow-x-hidden'>
                {
                    getMessages?.map((message) => {
                        return (
                            <div key={message._id} className='flex flex-col gap-5'>
                                {friendInfo?._id === message.author ?
                                    <div className=' flex flex-row gap-2 my-2'>
                                        <Image src={`${friendInfo?.imageUrl || Loading}`} alt='logo' width={30} height={30} className='rounded-full object-contain mb-auto' />
                                        <div className='overflow-hidden bg-gray-400 rounded-md self-start mr-auto max-w-[70%] p-1'>{message.content}</div>
                                    </div>
                                    :
                                    <div className='flex flex-row gap-2 self-end my-2'>
                                        <div className='overflow-hidden bg-green-400 rounded-md self-end ml-auto max-w-[70%] p-1'>{message.content}</div>
                                        <Image src={`${userInfo?.imageUrl || Loading}`} alt='logo' width={30} height={30} className='rounded-full object-contain mb-auto' />
                                    </div>
                                }
                            </div>
                        )

                    })
                }
            </section>


            <div className='flex flex-row gap-3'>
                {/*<input type='file' onChange={selectFile}/>*/}
                <input placeholder='enter message'
                    className='border border-gray-400 w-full mt-auto rounded-md p-1'
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }}

                />
                <button className='bg-green-400 rounded-lg px-2 py-1' onClick={messageDeliver}>Send</button>
            </div>


        </main>
    )
}

export default page