import React, {useEffect} from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Chats from "../components/chats";
import Messages from "../components/messages";
import {ChatProvider} from '../context/chatProvider'
const ChatPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        async function check() {
            if(!localStorage.getItem('userInfo')){
                navigate('/login');
                return;
            }
            try {
                const token  = JSON.parse(localStorage.getItem('userInfo')).token;
                if(!token || !localStorage.getItem('userInfo')){
                    localStorage.clear();
                    navigate('/login');
                }
                const AuthHeader = 'Bearer '+ token;
                const config = {
                    headers: {
                        Authorization : AuthHeader, 
                    }
                }
                // const {data} =  await axios.post("api/chats/check/",{token},config);
                const {data} =  await axios.get("api/chats/check/",config);
                if(data.status === 'Failure' || data ==='Request not authorized'){
                    localStorage.clear();
                    window.alert('Make sure you have Logged in!');
                    navigate('/login');
                }
                
            } catch (error) {   
            }
        }
        check();
        
    },[])

    return (
    <ChatProvider>
        <div className='flex overflow-y-clip'>
            <Chats />
            <Messages />
        </div>
    </ChatProvider>

    )
}

export default ChatPage
