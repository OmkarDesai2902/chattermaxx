import axios from "axios"
import loginImage from '../images/login image.png'
import React, { useState } from "react";
import { Link,  useNavigate } from "react-router-dom";


function LoginPage() {

  const [formData,setFormData] = useState({
    email :'',
    password :''
  })

  const navigate = useNavigate();

  React.useEffect(()=>{
    try {
      const token  = JSON.parse(localStorage.getItem('userInfo')).token;
      if(token){
        navigate("/chats");
      }
    } catch (error) {
    }
    
  },[])

  

  const handleChange = (e) =>{
    const {name, value } = e.target;
    setFormData((prevData)=> ({...prevData, [name]:value}));
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const {email, password} = formData;
    // console.log(email, password);
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    //  "proxy": "http://127.0.0.1:8000/",
    try {
      
      
      const {data} =  await axios.post("https://chattermaxx-server.onrender.com/api/user/login/",{email, password});
      console.log(data);
      if(data.loggedIn){
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chats");
      }
      else{
        window.alert('Invalid Credentials');
        localStorage.clear();
        navigate("/login");
        setFormData((prevData)=> ({email :'', password :''}));
      }
      
    } catch (error) {
      console.log(error);
    }
    

  }

  return (
    <div className="bg-[#050506] " >
      <div className='flex flex-row align-middle justify-center text-3xl py-3 border-b-2 border-b-gray-500'>
        <p className="text-white">Chatter<b className='text-[#008eff]'>Maxx</b> </p>
      </div>
      <div className="pt-5 flex flex-row justify-evenly ">
          <div>
            <img className='h-auto max-w-full' src={loginImage} alt='Hero logo' />
          </div>
          <form onSubmit={handleSubmit}>
            <div className='bg-[#FFF] px-20 flex flex-col pt-20 pb-20 rounded-xl' >
              <div>
                <h1 className='text-themecolor text-xl font-bold'>LOGIN</h1>
              </div>
              <div className='mt-4  flex flex-col '>
                <label className='flex flex-col'>Email :
                  <input name="email" value={formData.email} onChange={handleChange}
                  type="email" placeholder="Email" required
                  className="mt-2 outline-themecolor outline-1 w-[400px] border rounded border-gray-300   pl-2 py-1"/>
                </label> 
              </div>
              <div className='mt-3 flex flex-col '>
                <label className='flex flex-col'>Password :
                <input name="password" value={formData.password} onChange={handleChange}
                type="password" placeholder="Password"  required
                className="mt-2 outline-themecolor outline-1 w-[400px] border rounded border-gray-300 pl-2 py-1"/>
                </label> 
              </div>
              <div className='mt-6 flex flex-col'>
                <input type="submit" value="Login"  
                className="w-[400px] gradient-blue font-semibold text-white cursor-pointer rounded py-2"/>
                <span className="mt-2">Don't have an account? 
                <Link to="/register" className="text-themecolor"> Register here</Link>
                </span>
              </div>  
            </div>
          </form>
      </div>
    </div>
  );
}

export default LoginPage;
