import React from 'react'
import MessageHeaderImage1 from '../images/MessageHeaderImage1.svg'
import MessageHeaderImage2 from '../images/MessageHeaderImage2.svg'
import MessageTopBar from './MessageTopBar';
import MessagesContent from './MessagesContent';
import {useChat,selectedChatID}  from "../context/chatProvider";



export default function Messages()  {
  const { chats, selectedChatID } = useChat();

  return (
    <div className="w-[100%] bg-[#24262c]">
      {
       selectedChatID === '' ? 
       (
        <div className="flex flex-col items-center pt-[14%]">
          <div>
            <img src={MessageHeaderImage1} className="w-[100%]" alt="" />
          </div>
          <div>
          </div>
            <p className='font-bold text-4xl text-white'>Welcome to ChatterMaxx</p>
            <p className='text-gray-400 mt-3'>You are using a highly scalable Chatting App🚀</p>
            <p className='text-gray-400 '>Powered with Redis, Apache Kafka and Postgres⚡</p>
        </div>
       )
       : 
       (
        <div>
          <MessageTopBar  />
          <MessagesContent selectedChatID={selectedChatID}  />

          <div>
            
            {/* {

            chats && Object.keys(chats).length !== 0 ? 
            (
              chats.map((data) =>{
                return (
                  <p key={data.chatId} >{data.chatId}</p>
                )
              })
            ) : ''
            } */}
            
          </div>

          {/* {selectedChatID} */}
          <a className='hidden' href="https://storyset.com/social-media">Social media illustrations by Storyset</a>
       
        </div>
       )
      }
      
    </div>
  )
}


