import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { PenBox } from 'lucide-react'
import {SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/nextjs'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser();
  return (
    <nav className='mx-auto py-2 px-4 flex justify-between shadow-md border-b-2'>
      <Link href={'/'}>
            <h4 className='text-xl font-bold tracking-wider text-orange-600'>Schedula</h4>
      </Link>
      <div className='flex items-center gap-2'>
        <Link href={'/events?create=true'}>
        <Button> <PenBox /> Create Event</Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header
