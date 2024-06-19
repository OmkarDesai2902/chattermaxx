import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import chaticon from '../images/chaticon.svg'
import optionicon from '../images/optionicon.svg'
import {useChat}  from "../context/chatProvider";
import { Toast , Label, Modal, TextInput,Tooltip,Dropdown } from "flowbite-react";
import { HiOutlineSearch, HiOutlineUser, HiLogout } from "react-icons/hi";
import axios from 'axios';

const ChatTopBar = () => {
  const navigate = useNavigate();
  const {profileInfo, getDetails,setSelectedChatID, setReciever,setIsGroupChat} = useChat();
  const [openModal, setOpenModal] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSelectedUsers, setAllSelectedUsers] = useState(new Set());
  const [groupName, setGroupName] = useState('');

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
      
      let {data : usersData} =  await axios.post("api/user/",{searchTerm} ,config);
      setSearchResults(usersData.data)
    }
    catch(error){
      //console.log(error)
    }
  }

  useEffect(()=>{
    if(openModal || openChatModal){
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
    if(openModal){
      handleSelectedCheckboxes()
    }
  },[])

  useEffect(()=>{
    if(openModal){
      handleSelectedCheckboxes()
    }
  },[searchTerm,allSelectedUsers])

  const handleCheckboxChange = (e) =>{
    if(e.target.checked){
      setAllSelectedUsers(prev => new Set(prev.add(e.target.value)))
    }
    else{
      setAllSelectedUsers(
        prev => new Set([...prev].filter(user => user !== e.target.value))
      )
    }
  }

  let filterTime3;

  const removeToast = (id) =>{
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
  
  const createGroup = async () =>{
    if(groupName === '' || !groupName){
      alert('Enter Group Name');
      return;
    }
    
    const token  = JSON.parse(localStorage.getItem('userInfo')).token;
    const AuthHeader = 'Bearer '+ token;
    const config = {
        headers: {
            Authorization : AuthHeader, 
        }
    }

    if(allSelectedUsers.size === 0){
      return
    }

    let users = []
    Array.from(allSelectedUsers).map((allSelectedUser)=>{
      let juser =  JSON.parse(allSelectedUser)
      let userID = juser.id
      users.push(userID)
    })

    

    let {data : usersData} =  await axios.post("api/chats/",
      {
        users:users,
        isGroupChat :  'TRUE',
        groupChatName: groupName
      } 
    ,config);
    getDetails()

    // console.log(allSelectedUsers)
    // console.log(usersData)  

    //setting msg top bar
    // setSelectedChatID(usersData.createdChat.id)
    // setReciever(groupName)
    // setIsGroupChat("TRUE")
    alert(`${groupName} is created!`)

    //Close Modal 
    setOpenModal(false)
    setAllSelectedUsers(new Set())
    setSearchResults([])
    setSearchTerm('')
    setGroupName('')

  }
  
  const  createChat = async (id,recieverName) =>{
    const token  = JSON.parse(localStorage.getItem('userInfo')).token;
    const AuthHeader = 'Bearer '+ token;
    const config = {
        headers: {
            Authorization : AuthHeader, 
        }
    }
    let users = []
    users.push(id)
    
    let {data : usersData} =  await axios.post("api/chats/",
      {
        users:users,
        isGroupChat :  'FALSE',
        groupChatName: ''
      } 
    ,config);
    getDetails()

    // console.log(usersData)

    if(usersData.status === "Failure" && usersData.message === "Chat already exists with user"){
      setSelectedChatID(usersData.existsChat[0].id)
    }
    if(usersData.status === "Success"){
      setSelectedChatID(usersData.createdChat.id)
    }

    //setting msg top bar
    setReciever(recieverName)
    setIsGroupChat("FALSE")

    //Close Modal 
    setOpenChatModal(false)
    setSearchTerm('');
    setSearchResults([])

  }

  const signOut = ()=>{
    localStorage.removeItem('userInfo');
    localStorage.clear();
    navigate('/login');
  }


  return (
    <div className='bg-themecolor py-2 pl-2 flex items-center border-b-[2px] border-gray-500/45'>
          {/* <div className='rounded-[60%] border-[1px] flex items-center justify-center bg-white h-10 w-10'>
                  <span className=" text-themecolor/90 font-extrabold text-[19px]">
                      {profileInfo && profileInfo.name !== '' ? (profileInfo.name.charAt(0).toUpperCase()) : ('U') }
                  </span>
          </div>     */}
        <div className='flex justify-between w-[100%] pr-4 py-1'>
          <div>
            <span className=" font-bold ml-2  text-white text-2xl">
                {/* Welcome {
                profileInfo && profileInfo.name !== '' ? (profileInfo.name.toUpperCase()) : ('User') 
              } */}
              ChatterMaxx
            </span>
          </div>
          <div className='mt-[4px] flex'>
            <button onClick={()=> setOpenChatModal(true)}>
              <Tooltip content="New Chat" style="light">
                <img src={chaticon} alt="" className='h-[21px] '/>
              </Tooltip>
            </button>
            
            <Modal show={openChatModal} onClose={() => {
              setOpenChatModal(false)
              setSearchTerm('');
              setSearchResults([])
              }}>
              <Modal.Header>Create a new Chat</Modal.Header>
              <Modal.Body className='pt-2'>
              <div className="">
                    <div className="">
                      <div className=" mb-2 block">
                        <Label htmlFor="searchUser1" value="Search people" className='text-md' />
                      </div>
                      <TextInput id="searchUser1" type="text" rightIcon={HiOutlineSearch} placeholder="Start typing to add new chat..." onChange={handleSearchChange}/>
                    </div>  

                    <hr className='bg-black my-2'/>
                      {
                        searchResults.length === 0 ? 
                        (
                          <div>
                            {searchTerm === '' ? '' : 'No Users found' } 
                          </div> 
                        ) :
                        (
                          <div className='flex'>
                            <ul className=" w-[100%]  overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                              <p className='mb-2'>Click on user to start chatting</p>
                              { 
                                searchResults.map((searchResult)=>{
                                  return (
                                    <li key={searchResult.id} className='cursor-pointer border-gray-200 rounded-t-lg mb-2' >
                                      <div className=" cursor-pointer flex h items-center ps-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                          <input  id={searchResult.id} type="checkbox"
                                          value={`{ 
                                              "id" :  "${searchResult.id}" , 
                                              "name" :  "${searchResult.name} "
                                            }
                                          `}
                                          name='usersCheckbox'
                                          // onChange={handleCheckboxChange}
                                          onClick={()=> createChat(searchResult.id,searchResult.name)}
                                          className="hidden cursor-pointer w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                          <label  htmlFor={searchResult.id} className=" cursor-pointer w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">  
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
              </Modal.Body>
            </Modal>


            

            <Dropdown label="" icon={optionicon} renderTrigger={() => 
              <button >
                <Tooltip content="Options" style="light">
                  <img src={optionicon} alt="" className='h-[22px] ml-4'/>
                </Tooltip>
              </button>
            } inline>
              <Dropdown.Item icon={HiOutlineUser} onClick={() => setOpenModal(true)}>
                Create new Group
              </Dropdown.Item>
              <Dropdown.Item icon={HiLogout} onClick={signOut} >Sign out</Dropdown.Item>
            </Dropdown>

            <>
                <Modal show={openModal} onClose={() => {setOpenModal(false)
                  setAllSelectedUsers(new Set())
                  setSearchResults([])
                  setSearchTerm('')
                  setGroupName('');
                }}>
                <Modal.Header>Create a Group</Modal.Header>
                <Modal.Body className='pt-2'>
                  <div className="">
                    <div className="flex items-center justify-between">
                      <div className="mr-2">
                        <Label htmlFor="groupName" value="Group Name" className='text-md' />
                      </div>
                      <div className='w-[77%]'>
                      <TextInput id="groupName" type="text" placeholder="Enter Group Name"
                        value={groupName}
                        onChange={(event)=> {
                          setGroupName(event.target.value);
                           //console.log(groupName) 
                          }
                        }
                      />
                      </div>
                    </div>  
                    <div className="flex items-center justify-between mt-2">
                      <div className=" mr-2">
                        <Label htmlFor="searchUser" value="Search People" className='text-md' />
                      </div>
                      <div className='w-[77%]'>
                        <TextInput id="searchUser" type="text" rightIcon={HiOutlineSearch} placeholder="Start typing to add people..." onChange={handleSearchChange}/>
                      </div>
                    </div>  

                    <hr className='bg-black my-2'/>

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
                                          value={`{ 
                                              "id" :  "${searchResult.id}" , 
                                              "name" :  "${searchResult.name} "
                                            }
                                          `}
                                          name='usersCheckbox'
                                          onChange={handleCheckboxChange}
                                          className="w-4 h-4 hidden text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
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
                      <hr className='bg-black my-1'/>
                      {
                        allSelectedUsers.size === 0 ? '' : 
                        <p className='text-md font-semibold'>
                          Added Users :
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
                                  <HiOutlineUser className="h-4 w-4 text-themecolor dark:text-themecolor" />
                                  <div className="pl-4 text-sm font-semibold text-black">{ juser.name }</div>
                                  <Toast.Toggle onDismiss={() => removeToast(
                                    `
                                    { 
                                      "id" :  "${juser.id}" , 
                                      "name" :  "${juser.name} "
                                    }
                                  `
                                  )} />
                                </Toast>  
                              </div>
                            )
                          })
                      }
                      </div>

                      {/* <Toast className='mr-2'>
                        <HiOutlineUser className="h-2 w-2 text-cyan-600 dark:text-cyan-500" />
                        <div className="pl-4 text-sm font-normal">user 1</div>
                        <Toast.Toggle />
                      </Toast>   */}
                      
                     
                      
                       
                  </div>
                </Modal.Body>
                {
                  allSelectedUsers.size <= 1 ? '' 
                  : 
                  <Modal.Footer className="flex justify-center pt-0 pb-6">
                    <button className='bg-themecolor/90 py-2 px-20 text-white rounded-md hover:bg-themecolor' onClick={createGroup}>Create Group
                    </button>
                  </Modal.Footer>
                }
                
              </Modal>              
              </>
          </div>
          
          
        </div>
      </div>
  )
}

export default ChatTopBar
