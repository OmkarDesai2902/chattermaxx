import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import io from "socket.io-client";

const ChatContext = createContext();

export const useChat = () =>{
    const state = useContext(ChatContext);
    if(!state) throw new Error('State is undefined');
    return state;
}

export const ChatProvider = ({children}) => {

    const navigate = useNavigate();
    
    const [chats,setChats] = useState({});
    // const [messages,setMessages] = useState('Messages');
    // const [messages, setMessages] = useState(new Set())
    const [messages, setMessages] = useState(new Set())
    const [noMessages, setNoMessages] = useState(true)
    const [messagesJSON, setMessagesJSON] = useState(new Set())
    const [messagesProgess, setMessagesProgess] = useState(0)
    const [profileInfo,setProfileInfo] = useState({name : ''});
    const [selectedChatID,setSelectedChatID] = useState('')
    const [reciever,setReciever] = useState('')
    const [isGroupChat,setIsGroupChat] = useState(false)
    const [chatUsersInfo,setChatUsersInfo] = useState({})
    const [newMessage, setNewMessage] = useState('')
    const [messageCursor, setMessageCursor] = useState(0)
    const [scrolled, setScrolled] = useState(0)
    const [typing, setTyping] = useState(false)
    const [rooms, setRooms] = useState(new Set())

    //let socket = io("http://localhost:8000")
    const [socket,setSocket] = useState()
    useEffect(()=>{
      const _socket = io(process.env.SERVERURL);
      setSocket(_socket);

      return ()=>{
          _socket.disconnect();
          setSocket(undefined)
          // console.log('socket disconnected in context provider ', _socket)
      };
    },[])

   

    let getDetails = async () => {

      try{
        if(!localStorage.getItem('userInfo')){
          navigate('/login');
          return;
        }
        const token  = JSON.parse(localStorage.getItem('userInfo')).token;
        const AuthHeader = 'Bearer '+ token;
        const config = {
            headers: {
                Authorization : AuthHeader, 
            }
        }
        let {data : chatsData} =  await axios.get("https://chattermaxx-server.onrender.com/api/chats/",config);
        setProfileInfo({name : chatsData.loggedInUser, id : chatsData.loggedInUserID});
        setChats(chatsData.finalResponse);
        // console.log(chatsData)

        
      }
      catch(error){
        // console.log(error)
      }
    }
    
    useEffect(() => {
     getDetails();
    }
    ,[])
  
  
    
  return (
    
    <ChatContext.Provider value={{ chats,setChats, messages, setMessages, profileInfo, selectedChatID,setSelectedChatID, reciever, setReciever, getDetails, isGroupChat,setIsGroupChat,chatUsersInfo,setChatUsersInfo, newMessage, setNewMessage, messageCursor, setMessageCursor, scrolled, setScrolled, messagesJSON, setMessagesJSON, noMessages, setNoMessages, messagesProgess, setMessagesProgess, socket,typing, setTyping }}>
        {children}
    </ChatContext.Provider>
  )
}


