import React from 'react'
import searchicon from '../images/search.svg'
// import { Button,  Label, Modal, TextInput,Tooltip } from "flowbite-react";
// import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = () => {
  function change() {
    // console.log('Search happenig')
    

  }
  return (
    <div className='border-b-[1px] border-gray-500/45 bg-themecolor'>
        <div className="search">
            <input type="text" className='outline-none-focus bg-themecolor' placeholder="Search people here..."/>
            <div className="button-src ">
                <button onClick={change} ><img src={searchicon}  /></button>
            </div>
        </div>

        {/* <div className="px-3 py-2">
          <TextInput className='bg-white' id="email4" type="email" rightIcon={HiOutlineSearch} placeholder="Search people here..."  />
        </div> */}
    </div>
  )
}

export default SearchBar
