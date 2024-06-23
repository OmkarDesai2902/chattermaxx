import React, {useEffect, useState, useRef} from 'react'
import { IoMdSend } from "react-icons/io";
import { Button , Progress } from 'flowbite-react';
import ScrollableFeed from 'react-scrollable-feed'
import {useChat} from '../context/chatProvider'
import ChatBubble from './ChatBubble'
import axios from 'axios';

const MessagesContent = () => {

    const {newMessage, setNewMessage, messageCursor, setMessageCursor, messages, setMessages, selectedChatID, scrolled, setScrolled, messagesJSON, setMessagesJSON, setNoMessages, noMessages,
    messagesProgess, setMessagesProgess, isGroupChat, profileInfo, socket, typing, setTyping,chatUsersInfo
    } = useChat();
    const[reachedEnd, setReachedEnd] = useState(false)
    const[pseudoTyping, setPseudoTyping] = useState(false)
   

    

    const messagesEndRef = useRef(null)
    
    const scrollToBottom1 = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    
   

    useEffect(()=>{
        // console.log('chatUsersInfo ' ,chatUsersInfo)
        socket.emit('setup',profileInfo.id)
        // console.log('socket present', socket)

        
        socket.on('message recieved',(msgJson)=>{
            let stringJSON = JSON.stringify(msgJson)
            // console.log('from emit ', msgJson.chatId)
            // console.log('select chat  ', selectedChatID)
            // console.log(msgJson.chatId === selectedChatID)
            if(msgJson.chatId === selectedChatID){
                setMessages(prev=> new Set([...prev, stringJSON]))
                setNoMessages(false);
                // console.log('if ', messagesJSON)
            }
            else{
            //    console.log('else', messagesJSON);
               //return;
            }
            
        })



        let typingTimeout1 = null;
        socket.on('set typing',()=>{
                //console.log('usf[] set typing')
                setTyping(true)
                clearTimeout(typingTimeout1)
                typingTimeout1 = setTimeout(()=>{
                    setTyping(false)
                    //console.log('usf set stop typing')
                }, 3000)
        })

        // socket.on('online',()=>{
        //     console.log('online on rcvd')
        // })

        scrollToBottom1();

        
    },[selectedChatID])

    useEffect(()=>{
        //console.log('SCID ',selectedChatID)
        scrollToBottom1();
    },[selectedChatID])

    let typingTimeout = null;
    const changeMessage = (e)=>{
        setNewMessage(e.target.value)

        setPseudoTyping(true)

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(()=>{
            setPseudoTyping(false)
            //console.log('set stop psuedo typing')
        }, 3000)
        
    }

    useEffect(()=>{
        //console.log('usf st psuedo typing is changed', pseudoTyping)
        if(pseudoTyping) {
            socket.emit('start typing',[selectedChatID,newMessage])   
            //console.log('usf st emitted start typing')
        }
        return () =>{
            //clearTimeout(typingTimeout);
        }
    },[pseudoTyping])


    

    const postMessage = async () =>{
        try{
        
        const messageJSON = {
            chatid : chatUsersInfo.chatId, 
            messagetext : newMessage
        }
        
        //let {data : newMessageData} =  await axios.post("api/messages/sentMessage/",messageJSON ,config);
        //console.log('nm ', newMessageData)

        //const {createdMessage} = newMessageData

        let d = new Date();
        let msec = Date.parse(d);

        //console.log(d, msec)
        let msg = messageJSON.messagetext
        //let msgId = createdMessage.id   
        let chatId = messageJSON.chatid
        let senderName = profileInfo.name
        let senderid = profileInfo.id
        // let timestamp = msec+86400000
        let timestamp = msec

        let msgJson = {
            msg,
            //msgId,
            chatId,
            senderName,
            timestamp,
            senderid
        }

        setNoMessages(false);
        let stringJSON = JSON.stringify(msgJson)
        setMessages(prev=> new Set([...prev, stringJSON]))
        
        let chatUsers = [];

        chatUsersInfo.userInfo.map((chat) =>{
            let id = chat.id
            chatUsers.push(id);
        })

        //console.log('C ', chatUsers)

        // console.log('post messga',msgJson)
        if(socket){
            // console.log('emitted')
            socket.emit('new message',[msgJson,chatUsers])
        }
        else{
            // console.log('not emitted', socket);
        }

        }
        catch(error){
        // console.log(error)
        }
    }
    // const postMessage = async () =>{
    //     try{
    //     const token  = JSON.parse(localStorage.getItem('userInfo')).token;
    //     const AuthHeader = 'Bearer '+ token;
    //     const config = {
    //         headers: {
    //             Authorization : AuthHeader, 
    //         }
    //     }
    //     const messageJSON = {
    //         chatid : selectedChatID, 
    //         messagetext : newMessage
    //     }
        
    //     let {data : newMessageData} =  await axios.post("api/messages/",messageJSON ,config);
    //     console.log('nm ', newMessageData)

    //     const {createdMessage} = newMessageData

    //     let msg = createdMessage.messagetext
    //     let msgId = createdMessage.id   
    //     let chatId = createdMessage.chatid
    //     let senderName = createdMessage.sendername
    //     let senderid = createdMessage.senderid
    //     let timestamp = createdMessage.timestamp

    //     let msgJson = {
    //         msg,
    //         msgId,
    //         chatId,
    //         senderName,
    //         timestamp,
    //         senderid
    //     }

    //     if(selectedChatID === createdMessage.chatid){
    //         let stringJSON = JSON.stringify(msgJson)
    //         setMessages(prev=> new Set([...prev, stringJSON]))
    //     }
    
    //     if(socket){
    //         console.log('emitted')
    //         socket.emit('new message',[msgJson,newMessageData.chatUsers])
    //     }
    //     else{
    //         console.log('not emitted', socket);
    //     }

    //     }
    //     catch(error){
    //     console.log(error)
    //     }
    // }

    const sendMessage = (e) =>{
        e.preventDefault();
        // console.log(newMessage, selectedChatID);
        setNewMessage('');
        postMessage();
        scrollToBottom1();

    }
    
    const handleScroll = (event) =>{ 
        const scrollableDiv = event.target
        let diff = scrollableDiv.scrollTop - scrolled;
        setScrolled(scrollableDiv.scrollTop);
        if(diff < -14){
            if (!reachedEnd) {
                getMessages()
            }

        }
    }

    const scrollToBottom =  () =>{ 
        const scrollableDiv = document.getElementById('scrollable-div')
        if(scrollableDiv){
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }
    }


    const getMessages = async () =>{
        try{
            setMessagesProgess(0)
            const token  = JSON.parse(localStorage.getItem('userInfo')).token;
            const AuthHeader = 'Bearer '+ token;
            const config = {
                headers: {
                    Authorization : AuthHeader, 
                }
            }
           
            let {data : messageData} =  await axios.get(`https://chattermaxx-server.onrender.com/api/messages/${selectedChatID}&${messageCursor}`,config);
            setMessagesProgess(30)
            if (messageData.nextCursor === 'Reached End') {
                setReachedEnd(true)
            }
            if(messageData.status === 'Failure' && messageData.message === 'No messages'){
                setNoMessages(true)
            }
            if (messageData.nextCursor && messageData.status === 'Success' && messageData.nextCursor !== 'Reached End' ) {
                setMessageCursor(messageData.nextCursor)
                if(messageData.getMessage1){
                    setNoMessages(false)
                    messageData.getMessage1.toReversed().map(getmsg =>{
                        
                        let msg = getmsg.messagetext
                        //let msgId = getmsg.id
                        let chatId = getmsg.chatid
                        let senderName = getmsg.sendername
                        let senderid = getmsg.senderid
                        let timestamp = getmsg.timestamp

                        // console.log('ts ',timestamp)

                        let msgJson = {
                            msg,
                            //msgId,
                            chatId,
                            senderName,
                            timestamp,
                            senderid
                        }

                        
                        if(selectedChatID === getmsg.chatid){
                            let stringJSON = JSON.stringify(msgJson)
                            setMessages(prev=> new Set([stringJSON,...prev]))
                        }
                        setMessagesProgess(70)

                    })
                }

                if(messageData.getMessage2){
                    setNoMessages(false)
                    messageData.getMessage2.toReversed().map(getmsg =>{

                        let msg = getmsg.messagetext
                        //let msgId = getmsg.id   
                        let chatId = getmsg.chatid
                        let senderName = getmsg.sendername
                        let senderid = getmsg.senderid
                        let timestamp = getmsg.timestamp

                        let msgJson = {
                            msg,
                            //msgId,
                            chatId,
                            senderName,
                            timestamp,
                            senderid
                        }

                        if(selectedChatID === getmsg.chatid){
                            let stringJSON = JSON.stringify(msgJson)
                            setMessages(prev=> new Set([stringJSON,...prev]))
                        }
                        
                    })
                }
            }
            setMessagesProgess(100)
        }
        catch(error){
            // console.log(error)
        }
    }

    useEffect(()=>{
        setMessagesProgess(0)
        setNoMessages(true)
        setMessages(new Set())
        setMessagesJSON(new Set())
        setMessageCursor(0)
        setScrolled(0)
        setReachedEnd(false)
        getMessages()
        scrollToBottom()
        
        if(socket){
            try {
                socket.emit('join chat', selectedChatID)
                // console.log('joined new chat')
            } catch (error) {
                // console.log(error)
            }
            
        }
        
        // if(_socket){
        //     _socket.emit('join chat', selectedChatID)
        //     console.log('joined new chat')
        // }
    },[selectedChatID])

    useEffect(()=>{ 
        if(messages.size>0 && messages.size<=40){
            scrollToBottom()
        }
        if(messages.size>0){
            setMessagesJSON(Array.from(messages).map((item) => {
                if (typeof item === 'string') {
                    return JSON.parse(item);
                }
                else if (typeof item === 'object'){
                    return item;
                } 
            }));
        }
        //console.log(messagesJSON)
    },[messages])



    // useEffect(()=>{
    //     console.log('sct triggg',selectedChatID)
        
    //     socket.on('message recieved',(msgJson)=>{
    //         //socket.leave('selectedChatID')
    //         let stringJSON = JSON.stringify(msgJson)
    //         console.log('from emit ', msgJson.chatId)
    //         console.log('select chat  ', selectedChatID)
    //         console.log(msgJson.chatId === selectedChatID)
    //         if(msgJson.chatId === selectedChatID){
    //             setMessages(prev=> new Set([...prev, stringJSON]))
    //             setNoMessages(false);
    //             console.log('if ', messagesJSON)
    //         }
    //         else{
    //            console.log('else', messagesJSON);
    //            //return;
    //         }
            
    //     })

    //     return ()=>{
    //         //setMessages(prev=> new Set([...prev]))
    //     }
    // },[selectedChatID])
    
    
    
  return (
    <div className=''>
        
        <div className='h-[80vh] '>
            {/* <p>{messageCursor}</p>
            <p>{selectedChatID}</p> */}
            <p className='text-white' >{selectedChatID}</p>
            <p className='text-white'>{chatUsersInfo.chatId}</p>
            {/* <ScrollableFeed style={{height:'70px'}} onScroll={(event)=> handleScroll(event)}> */}
                <div id='scrollable-div' style={{"maxHeight": "inherit", "height": "inherit", "overflowY": "auto"}}
                onScroll={handleScroll} className='p-4 pb-14 bg-themecolor'
                >
                    {/* { items.map((item, i) => <div key={i}>{item}</div>)} */}
                    
                    {/* {Array.from(messages).map((item, i) => <div key={i}>{item}</div>)} */}

                    {
                        messagesProgess === 100 ?
                            
                            !noMessages ? 
                                messagesJSON.length > 0 ?
                                
                                    messagesJSON.map((mJson,i) =>{
                                        let date = new Date(mJson.timestamp) ;
                                        //console.log(date)
                                        let formattedDate = `${date.getUTCDate()}/${(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${date.getHours().toString()}:${date.getMinutes()}`;

                                        let isLoggedInUserIsSender = mJson.senderid === profileInfo.id ? true : false
                                        //console.log(formattedDate)
                                        return(
                                            <div key={i}>
                                                <ChatBubble message={mJson.msg} time={formattedDate} senderName={mJson.senderName} isGroupChat={isGroupChat} isLoggedInUserIsSender={isLoggedInUserIsSender} />
                                                {/* {mJson.msg} */}
                                            </div>
                                        )
                                    })
                                : 
                                    ''
                            :
                            <div className="flex justify-center items-center h-[100%] -mt-14">
                                <p className="text-white">No Messages for this chat</p>    
                            </div>

                        :
                            <div className='relative top-[39%] px-28'>
                                <div className="flex justify-center mb-2">
                                    <p className='text-white'>Getting your messages</p>
                                </div>
                                <Progress progress={messagesProgess} color="dark" size="sm" />
                            </div>
                        
                    }

                   
                    <div className="my-div" ref={messagesEndRef} />
                </div>
        </div>


        <div className='fixed bottom-1 w-[75%] bg-[#09090B]'>
                <form onSubmit={sendMessage}>
                    <div className="search flex justify-between" style={{width:'98%'}} >
                        <div className='w-[100%]'>
                            <input type="text" className='outline-none-focus'  

                            style={{width:'100%',
                            color:"white", 
                            background:'#1F2937'}}

                            id='sendMessageInput'
                            placeholder="Start Typing..."
                            autoFocus
                            value={newMessage}
                            onChange={changeMessage}
                             />
                        </div>
                        <div className="">
                            <Button type='submit' color='dark' className="py-1" style={{borderRadius: '0px'}} >
                                <IoMdSend/>
                            </Button>
                        </div>
                    </div>
                </form>
            </div> 

    </div>
  )
}

export default MessagesContent
