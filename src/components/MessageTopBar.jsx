import React from 'react'
import chaticon from '../images/chaticon.svg'
import optionicon from '../images/optionicon.svg'
import {useChat}  from "../context/chatProvider";
import { useState, useEffect } from 'react';
import { Toast , Label, Modal, TextInput,Tooltip,Dropdown } from "flowbite-react";
import { HiOutlineSearch, HiOutlineUser, HiCheck, HiOutlinePencilAlt  } from "react-icons/hi";
import axios from 'axios';

const MessageTopBar = () => {
  const {reciever, isGroupChat, chatUsersInfo, setReciever, chats, setChats ,setChatUsersInfo, getDetails, typing, setTyping  } = useChat();
  
  const [openOptionsModal,setOpenOptionsModal] = useState(false)
  const [groupName, setGroupName] = useState();
  const [searchTerm,setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSelectedUsers, setAllSelectedUsers] = useState(new Set());
  const [addNewUser,setAddNewUser] = useState(true)
  const [isGroupNameChange,setIsGroupNameChange] = useState(false)
  const [groupAdminID,setGroupAdminID] = useState('');
  const [groupUserInfo,setGroupUserInfo] = useState('');
  const [loggedInUserID,setLoggedInUserID] = useState('');
  
  


  const handleGroupNameEdit = () =>  {
    setGroupName(reciever);
    setIsGroupNameChange(!isGroupNameChange)
  }
  const handlKeyDownGroupName = (event) =>{
    if(event.key === 'Enter'){
      setReciever(groupName)
      updateGroupName(chatUsersInfo.chatId,groupName)
      
      let updatedChat = {}
      chats.map(chat => {
        if (chat.chatId === chatUsersInfo.chatId) {
            updatedChat = chat;
            updatedChat.groupchatname = groupName
        }
      })

      setChats(
        prev => ([...prev].filter(chat => chat.chatId !== chatUsersInfo.chatId))
      )
      setChats(prev => [updatedChat,...prev])

      //close modal
      setOpenOptionsModal(false)
      setAllSelectedUsers(new Set())
      setSearchResults([])
      setSearchTerm('')
      setIsGroupNameChange(false)
      
      
    }
  }

  const updateGroupName = async (chatId, groupName)=>{
    try{
      const token  = JSON.parse(localStorage.getItem('userInfo')).token;
      const AuthHeader = 'Bearer '+ token;
      const config = {
          headers: {
              Authorization : AuthHeader, 
          }
      }
      
      const jsonData = {
        chatId : chatId,
        groupName : groupName
      }
      
      let {data : groupData} =  await axios.patch("https://chattermaxx-server.onrender.com/api/chats/rename",jsonData ,config);
      
      //console.log(groupData)
    }
    catch(error){
      // console.log(error)
    }
  }

  const updateGroupMembers = async ()=>{
    document.body.style.cursor = 'progress'
    if(allSelectedUsers.size <2){
      alert('Group members can not be less than 3')
      return;
    }
    let users = [];
    Array.from(allSelectedUsers).map((allSelectedUser)=>{
      let juser =  JSON.parse(allSelectedUser)
      users.push(juser.id)
    })

    const token  = JSON.parse(localStorage.getItem('userInfo')).token;
    const AuthHeader = 'Bearer '+ token;
    const config = {
        headers: {
            Authorization : AuthHeader, 
        }
    }
    
    let chatId = chatUsersInfo.chatId;
    let {data : usersData} =  await axios.patch("https://chattermaxx-server.onrender.com/api/chats",{chatId,users} ,config);
    
    //console.log(usersData.updateChatDetails.id)
    //console.log(usersData.updateChatDetails.users.user)
    //setChatUsersInfo()
    //console.log(usersData.userInfo)
    
    setChatUsersInfo((prevState)=> ({...prevState, userInfo:usersData.userInfo}))

    await getDetails()
    setOpenOptionsModal(false)
    setSearchResults([])
    setSearchTerm('')

    document.body.style.cursor = 'default'
    //console.log(chatUsersInfo.userInfo)
  }

  let existingUsersPush;
  let existingUsersArray = [];

  useEffect(()=>{
    
    chats.map(chat => {
      if (chat.chatId === chatUsersInfo.chatId) {
        setGroupAdminID(chat.groupadminid);
        setGroupUserInfo(chat.userInfo);
        setLoggedInUserID(chat.loggedInUserID);
      }
    })
    if(loggedInUserID !== groupAdminID){
      setAddNewUser(false)
    }
    else{
      setAddNewUser(true)
    }

    if (chatUsersInfo) {
      chatUsersInfo.userInfo.map((chatUser)=>{
      existingUsersPush =`{"id":"${chatUser.id}","name":"${chatUser.name}"}`
        existingUsersArray.push(existingUsersPush)
      })
    }
    
  })

  

  const handleOptionsClick = () =>{
    setOpenOptionsModal(true);
    let mySet = new Set()
    existingUsersArray.forEach(item => mySet.add(item))
    setAllSelectedUsers(mySet)  

    if(loggedInUserID !== groupAdminID){
      setAddNewUser(false)
    }
    else{
      setAddNewUser(true)
    }
  } 

  

  let filterTime;
  const handleSearchChange = (event) => {
    clearTimeout(filterTime)
    filterTime= setTimeout(()=>{
      if(event.target.value !== ''){
        setSearchTerm(event.target.value);
      }
      else{
        setSearchResults([])
      }
    },1500)
  }

  const searchFetch = async () =>{
    try{
      const token  = JSON.parse(localStorage.getItem('userInfo')).token;
      const AuthHeader = 'Bearer '+ token;
      const config = {
          headers: {
              Authorization : AuthHeader, 
          }
      }
      let groupID = chatUsersInfo.chatId;
      let {data : usersData} =  await axios.post("https://chattermaxx-server.onrender.com/api/user/excludedgrp",{searchTerm,groupID} ,config);
      setSearchResults(usersData.data)
      //console.log(searchResults)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(openOptionsModal){
      searchFetch(); 
    }
  },[searchTerm])

  let filterTime2;
  const handleSelectedCheckboxes = () =>{
    clearTimeout(filterTime2)
    filterTime2 = setTimeout(() =>{
      Array.from(allSelectedUsers).map((allSelectedUser)=>{ 
        let juser =  JSON.parse(allSelectedUser)
        let checkBoxInput = document.getElementById(juser.id)
        if(checkBoxInput === null){
        }
        else{
          checkBoxInput.checked = true;
        }
      })
    }, 1000)
  }
  
  useEffect(()=>{
    if(openOptionsModal){
      handleSelectedCheckboxes()
    }
  },[])

  useEffect(()=>{
    if(openOptionsModal){
      handleSelectedCheckboxes()
    }
  },[searchTerm,allSelectedUsers])

  const handleCheckboxChange = (e) =>{
    if(e.target.checked){
      if(allSelectedUsers){
        setAllSelectedUsers(prev => new Set(prev.add(e.target.value)))
      }
    }
    else{
      if(allSelectedUsers.size <=2){
        alert('Group members can not be less than 3')
        return;
      }
      setAllSelectedUsers(
        prev => new Set([...prev].filter(user => user !== e.target.value))
      )
    }
  }

  let filterTime3;
  
  const removeToast = (id) =>{
    if(allSelectedUsers.size <=2){
      alert('Group members can not be less than 3')
      return;
    }
    let jsonID = JSON.parse(id)
    setAllSelectedUsers(
      prev => new Set([...prev].filter(user => {
        let userJson = JSON.parse(user)
        return(userJson.id !== jsonID.id)
      } ))
    )
    
    clearTimeout(filterTime3)
    filterTime3 = setTimeout(() =>{
      Array.from(allSelectedUsers).map((allSelectedUser)=>{ 
        let juser =  JSON.parse(allSelectedUser)
        let checkBoxInput = document.getElementById(juser.id)
        if(checkBoxInput === null){
        }
        else{
          checkBoxInput.checked = false;
        }
      })
    }, 1000)
    

  } 

  return (
    <div className='bg-themecolor py-2 pl-2 flex items-center border-b-[2px] border-gray-500/45'>
          
          <div className='rounded-[60%] border-[1px] flex items-center justify-center
           bg-themecolor h-10 w-10'>
              <span className=" text-white font-extrabold text-[19px]">
                  {reciever.charAt(0).toUpperCase()}
              </span>
          </div>          
          <div className='flex justify-between w-[100%] pr-4'>
            <div className='flex flex-col'>
              <span className=" font-bold ml-2 text-[14px] text-white">
                  {reciever.toUpperCase()}
              </span>
              <span className=" font-bold ml-2 text-[10px] text-white">
                 {typing && 'Typing...'} 
              </span>
            </div>
            <div className='mt-[4px] flex'>
              {
                isGroupChat && 
                ( 
                  <div>

                    {/* <button onClick={()=> setOpenOptionsModal(true)}> */}
                    <button onClick={handleOptionsClick}>
                      <Tooltip content="Group Options" style="light">
                        <img src={optionicon} alt="" className='h-[21px] '/>
                      </Tooltip>
                    </button>

                    <Modal show={openOptionsModal} onClose={() => {
                      setOpenOptionsModal(false)
                      setAllSelectedUsers(new Set())
                      setSearchResults([])
                      setSearchTerm('')
                      setIsGroupNameChange(false)
                      setGroupName(reciever)
                      }}>
                      <Modal.Header className='p-4'>
                        <div>
                          {reciever}
                        </div>
                      </Modal.Header>
                      <Modal.Body className='pt-3 '>
                          <div className=''>

                            {/* Group Name Text Box */}
                            
                              <div className='flex justify-center'>
                                <div className='rounded-[60%] border-[1px] flex items-center justify-center bg-white h-20 w-20'>
                                  <span className=" text-themecolor/90 font-extrabold text-[45px]">
                                      {reciever.charAt(0).toUpperCase()}
                                  </span>
                                </div>  
                              </div>  

                              <div className='flex justify-center items-center mb-2'>
                                <span className=" font-bold text-[28px] text-themecolor">
                                    {reciever.toUpperCase()} 
                                </span>
                                <button onClick={handleGroupNameEdit}>
                                  <HiOutlinePencilAlt className="ml-2 font-bold text-[28px] text-themecolor"  />
                                </button>
                                  

                              </div>

                            

                            { isGroupNameChange &&
                              <div className="flex  justify-between">
                                <div className="mr-2">
                                  <Label htmlFor="groupName" value="Group Name" className='text-md' />
                                </div>

                                <div className='w-[77%]'>
                                  <TextInput id="groupName" 
                                    type="text" color="white" 
                                    rightIcon={HiCheck}
                                    value={groupName}
                                    onChange={(e)=>{
                                      setGroupName(e.target.value)
                                    }}
                                    onKeyDown={handlKeyDownGroupName}
                                    autoFocus
                                  />
                                  <p className="mt-1 text-xs">Press Enter to save Group name</p>
                                </div>
                              </div>  
                            }
                            
                            {/* Group Name Text Box End*/}

                            {/* Show existing users toasts start*/}
                            {addNewUser && <div>
                                <hr className='bg-black my-1'/>
                              </div>
                            }
                            
                              {
                                allSelectedUsers.size === 0 ? '' : 
                                <p className='text-md font-semibold'>
                                  Group Members :
                                </p> 
                              }
                              <div className='flex overflow-auto my-1 '>
                              {
                                allSelectedUsers.size === 0 ?
                                ('') :
                                  Array.from(allSelectedUsers).map((allSelectedUser)=>{
                                    let juser =  JSON.parse(allSelectedUser)
                                    return(
                                      <div key={juser.id} className='mr-2'>
                                        <Toast className='w-60 border border-black/10'>
                                          <HiOutlineUser className="h-4 w-4 text-cyan-600 dark:text-cyan-500" />
                                          <div className="pl-4 text-sm font-semibold text-black">{ juser.name }</div>
                                          { addNewUser &&
                                            <Toast.Toggle onDismiss={() => removeToast(`{"id":"${juser.id}","name":"${juser.name}"}`)} />
                                          }
                                        </Toast>  
                                      </div>
                                    )
                                  })
                              }
                              </div>


                            {/* Show existing users toasts end*/}
                            

                            {/* Search people and add to group inputbox Start*/}

                            { addNewUser && 
                            
                            ( <div>

                              <div className="flex items-center justify-between mt-2">
                                {/* <div className=" mr-2">
                                  <Label htmlFor="searchUser" value="Search People" className='text-md' />
                                </div> */}
                                <div className='w-[100%]'>
                                  <TextInput id="searchUser" type="text" rightIcon={HiOutlineSearch} placeholder="Start typing to add people..." 
                                  onChange={handleSearchChange}
                                  />
                                </div>
                              </div>  
                              
                              {/* Search people and add to group inputbox End*/}

                              {/* Show search results Start*/}
                            
                              {addNewUser && <div>
                                <hr className='bg-black my-2'/>
                              </div>}

                              {
                                searchResults.length === 0 ? 
                                (
                                  <div>
                                    {searchTerm === '' ? 'Start Typing to search users...' : 'No Users found' } 
                                  </div> 
                                ) :
                                (
                                  <div className='flex'>
                                    <ul className=" w-[100%]  overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">

                                      { 
                                        searchResults.map((searchResult)=>{
                                          return (
                                            <li key={searchResult.id} className='border-gray-200 rounded-t-lg mb-2' >
                                              <div className="flex h items-center ps-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                

                                                  <input  id={searchResult.id} type="checkbox"
                                                  value={`{"id":"${searchResult.id}","name":"${searchResult.name}"}`}
                                                  name='usersCheckbox'
                                                  onChange={handleCheckboxChange}
                                                  className="hidden w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                                  <label htmlFor={searchResult.id} className="cursor-pointer w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">  
                                                    {searchResult.name}
                                                  </label>

                                                </div>
                                            </li>
                                          )
                                        })
                                      }

                                    </ul>
                                  </div>
                                )
                                

                              }  

                            </div>
                            )
                            }

                            {/* Show search results End*/}
                            
                            
                            


                          </div>
                      </Modal.Body>
                      {addNewUser && 
                        <Modal.Footer className='flex justify-center'>
                          <button className='bg-themecolor/90 py-2 px-20 text-white rounded-md hover:bg-themecolor' onClick={updateGroupMembers} >
                            Save
                          </button>
                        </Modal.Footer>
                      }
                    </Modal>


                    
                  </div>
                )
              }
            </div>
            
            
          </div>
        </div>
  )
}

export default MessageTopBar
