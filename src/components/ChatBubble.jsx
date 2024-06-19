import React from 'react'
import profilePic from "../images/profile-picture-3.jpg";

const ChatBubble = ({message, time, senderName, isGroupChat, isLoggedInUserIsSender}) => {
  return (
    // <div className='mb-14 ml-3'>
    <div className={isLoggedInUserIsSender? 'flex flex-row justify-end chat-on-right' : 'chat-on-left'}>
        <div className='mt-2 min-w-[320px]'>
            <div className="flex items-start gap-2.5">
                {/* <img className="w-8 h-8 rounded-full" src={profilePic} alt="Jese image" /> */}
                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                    {
                        isGroupChat && 
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-white dark:text-white">{senderName}</span>
                            {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span> */}
                        </div>
                    }
                    
                    <div className="chat-on-left-div chat-on-right-div flex flex-col leading-1.5 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        {/* <p className="text-sm font-normal text-gray-900 dark:text-white"> That's awesome. I think our users will really appreciate the improvements.</p> */}
                        <p className="text-sm font-normal text-white">{message}</p>
                        <span className="text-sm font-normal text-white text-right">{time}</span>
                    </div>
                    {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatBubble
