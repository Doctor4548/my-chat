'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Outlined = ({children, address}: {children: React.ReactNode, address: string}) => {
    const pathName = usePathname();
  return (
    <Link href={address} className={cn('rounded-md w-fit ',{
        'bg-blue-600': pathName===address || pathName.startsWith(`${address}/`),
        'text-white': pathName===address || pathName.startsWith(`${address}/`)
    })}>
        {children}
    </Link>
  )
}

export default Outlined