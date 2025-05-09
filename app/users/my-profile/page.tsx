import NavigationBar from '@/components/navigation-bar/NavigationBar'
import React from 'react'
import MyProfile from './Details'

const page = () => {
  return (
    <div>
      <NavigationBar />
      <MyProfile />
    </div>
  )
}

export default page