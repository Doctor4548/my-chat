import React from 'react'

const ConversationCard = () => {
  return (
    <div className='w-full flex border border-gray-300 rounded-sm'>
        <div>
            Image
        </div>

        <div className='flex flex-col items-start'>
            <span>Name</span>
            <span>Last Mesage</span>
        </div>

    </div>
  )
}

export default ConversationCard