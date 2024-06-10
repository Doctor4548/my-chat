import React from 'react'
import { MessageOutlined, TeamOutlined } from '@ant-design/icons'
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/theme-toggle';
import Outlined from '@/components/Outlined';

const layout = ({children}: {children:React.ReactNode}) => {
  return (
    <main className='flex'>
      <section className='h-[95vh] m-3 border border-gray-300 rounded-md flex flex-col w-fit p-2 justify-between'>
        <div className='flex flex-col gap-3 mt-3'>
          <Outlined address='/conversations'>
            <MessageOutlined className='text-2xl border border-gray-300 rounded-md p-1' />
          </Outlined>
          <Outlined address='/friends'>
            <TeamOutlined className='text-2xl border border-gray-300 rounded-md p-1' />

          </Outlined>
        </div>

        <div className='flex flex-col gap-3 mb-3 items-center'>
          <ModeToggle />
          <UserButton />

        </div>
      </section>
      {children}

    </main>

  )
}

export default layout