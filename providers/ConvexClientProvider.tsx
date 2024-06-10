'use client'
import React from 'react'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Authenticated, AuthLoading } from 'convex/react';
import LoadingLogo from '@/components/LoadingLogo'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

const ConvexClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><LoadingLogo /></AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export default ConvexClientProvider