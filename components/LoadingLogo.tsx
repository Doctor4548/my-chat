import React from 'react';
import Image from 'next/image';


const LoadingLogo = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Image src='loading.svg' alt='Loading' width={100} height={100} className='duration-700 animate-pulse'/>
    </div>
  )
}

export default LoadingLogo