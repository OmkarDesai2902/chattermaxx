import React from 'react'

import {useChat}  from "../context/chatProvider";

const SingleChats = ({name, isGroupChat, lastMessage, handleChatClick, userInfo,chatId}) => {
    
    const {selectedChatID} = useChat()
    
    //{data.chatId === selectedChatID ? 'selected-chat' : ''}
    return (
        // <div className='cursor-pointer flex items-start py-3 pl-5 border-b-[1px] border-gray-500/45 ' 
        <div className={chatId === selectedChatID ? 
        'selected-chat mx-2 mt-2 bg-gray-500/45 rounded-md cursor-pointer flex items-start py-3 pl-5 border-b-[1px] border-gray-500/45' 
        : 
        'mx-2 mt-2 rounded-md bg-gray-500/45 cursor-pointer flex items-start py-3 pl-5 border-b-[1px] border-gray-500/45 '}
        onClick={()=>handleChatClick(name,isGroupChat,userInfo,chatId)}

        >
            <div className='rounded-[60%] border-[1px] flex items-center justify-center bg-themecolor h-10 w-10'>
                <span className=" text-white font-extrabold text-[19px]">
                    {name.charAt(0).toUpperCase()}
                    {/* U */}
                </span>
            </div>
            <div className='ml-3 flex flex-col'>
                {/* <span className='text-black font-bold text-[15px]'> */}
                <span 
                className={chatId === selectedChatID ? 'text-white font-bold text-[15px]' : 'text-white font-bold text-[15px]'}
                >
                    {name.toUpperCase()}
                    {/* User */}
                </span>
                {/* <span className='text-black text-[12px] '> */}
                {/* LAst messge start */}
                
                <span 
                className={chatId === selectedChatID ? 'text-themecolor font-bold text-[15px]' : 'text-white font-bold text-[15px]'}
                >
                    {lastMessage}
                    
                </span>

                {/* LAst messge end */}
            </div>
            
        </div>
    )
}

export default SingleChats
