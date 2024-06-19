import React, {useEffect} from 'react'
import {useChat}  from "../context/chatProvider";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"
import SingleChats from './SingleChats';
import ChatTopBar from './ChatTopBar';
import SearchBar from './SearchBar';


export default function Chats()  {

  const {chats, reciever , setReciever, setIsGroupChat, chatUsersInfo, setChatUsersInfo,setSelectedChatID,
    selectedChatID, setNewMessage, getDetails, setMessageCursor, setMessages, messages, messageCursor, scrolled, setScrolled, messagesJSON, setMessagesJSON, noMessages, setNoMessages,  setTyping} = useChat();
  
  useEffect(()=>{
    //getDetails()
  })

  const handleChatClick = (recieverName,isGroupChat,userInfo, chatId) =>{
    setMessages(new Set())
    setMessagesJSON(new Set())
    setNoMessages(true)
    setMessageCursor(0)
    setScrolled(0)
    setReciever(recieverName)
    setIsGroupChat(isGroupChat)
    setSelectedChatID(chatId)
    const userInfoJSON = {
      userInfo : userInfo,
      chatId : chatId
    }
    setChatUsersInfo(userInfoJSON)
    setNewMessage('')
    setScrolled(0)
    setMessages(new Set())
    setMessagesJSON(new Set())
    setNoMessages(true)
    setMessageCursor(0)
    setTyping(false)
    
    // console.log('from chat ', messages ,messageCursor)
    // console.log('usrinfo',userInfoJSON)
    // console.log('Chatuserinfo',chatUsersInfo)
    // console.log('Selected chat Id',selectedChatID)
    
  }   

  return (
    <div className="flex-none w-80 border-r-[2px] border-gray-500/45 h-[100vh] ">
    {/* // <div className="w-85 border-r-[1px] border-gray-500/45 h-[100vh] "> */}
      <ChatTopBar />
      <SearchBar/>
      <div className="overflow-y-scroll h-[470px] mb-52">
        {  
          chats && Object.keys(chats).length !== 0 ? (
            chats.map((data) =>{
              if(data.isGroupChat === 'FALSE'){
                return (
                  <SingleChats  key={data.chatId} name={data.userInfo[0].name} isGroupChat={false} 
                   userInfo={data.userInfo} chatId={data.chatId}
                   lastMessage={data.lastMessage} handleChatClick={handleChatClick} 
                   />
                  )
                }
                return (
                  <SingleChats key={data.chatId} name={data.groupchatname} isGroupChat={true}
                  lastMessage={data.lastMessage} userInfo={data.userInfo}  chatId={data.chatId}
                  handleChatClick={handleChatClick} 
                  />
                )
            })
            // 'chats'
            ) : 
            <div>
              <div className='flex justify-center mt-2'>
                <p className='font-normal'>
                  No Chats to show
                </p>
              </div>
              
              <div className='flex justify-center mt-1'>
                <p className='font-normal text-sm'>
                  Create a new chat
                </p>
              </div>
            </div>
        }
      </div>
      
    </div>
  )
}


