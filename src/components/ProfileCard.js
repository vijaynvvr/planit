import React from 'react'

const ProfileCard = (props) => {
  return (
    <div className="flex items-center border-2 border-black px-4 py-2 rounded-lg hover:bg-gray-100">
        <div className="font-bold text-xl rounded-full w-10 h-10 bg-gray-400 flex items-center justify-center mr-4">
            {props.icon}
        </div>
        <div>
            <div className="font-bold italic">{props.name}</div>
            <div className="text-sm italic">{props.email}</div>
        </div>
    </div>
  )
}

export default ProfileCard