import { SignInButton } from '@clerk/nextjs'
import React from 'react'

const SignIn = () => {
  return (
    <SignInButton mode='modal'>
        <button className='text-sm text-lightColor hover:cursor-pointer font-semibold bhover:text-darkColor hoverEffect'>Login</button>
   </SignInButton>
  )
}

export default SignIn
