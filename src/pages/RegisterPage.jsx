import { Link , useNavigate} from 'react-router-dom';
import loginImage from '../images/login image.png'
import { useState,useEffect } from "react";
import axios from "axios";

function RegisterPage() {
  const [formData,setFormData] = useState({
    name:'',
    email :'',
    password :'',
    profilePhoto:''
  })

  const navigate = useNavigate();

  useEffect(()=>{
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
    const {name, email, password} = formData;
    try {
      const {data} = await axios.post("api/user/register",{name, email, password});
      if(data.status ==='Success'){
        window.alert('Registered Successfully');
        navigate('/login');
      }
      else{
        window.alert(data.message);
        navigate('/register');
      }
    
    } catch (error) {
      // console.log(error);
    }
    

    //console.log(formData)
  }

  return (
    <div className="bg-[#050506]" >
      <div className='flex flex-row align-middle justify-center text-3xl py-3  border-b-2 border-b-gray-500'>
        <p className='text-white'>Chatter<b className='text-[#008eff]'>Maxx</b> </p>
      </div>
      <div className="pt-5 flex flex-row justify-evenly mb-10">
          <div>
            <img className='h-auto max-w-full' src={loginImage} alt='Hero logo' />
          </div>
          <form onSubmit={handleSubmit}>
            <div className='bg-[#FFF] px-20 flex flex-col pt-20 pb-20 rounded-xl' >
              <div>
                <h1 className='text-themecolor text-xl font-bold'>Register</h1>
              </div>
              <div className='mt-4  flex flex-col '>
                <label className='flex flex-col'>Name :
                  <input name="name" value={formData.name} onChange={handleChange}
                  type="text" placeholder="Name" required
                  className="mt-2 outline-themecolor outline-1 w-[400px] border rounded border-gray-300   pl-2 py-1"/>
                </label> 
              </div>
              <div className='mt-3 flex flex-col '>
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
                <input type="submit" value="Register"  
                className="w-[400px] gradient-blue font-semibold text-white cursor-pointer rounded py-2"/>
                <span className="mt-2">Already have an account? 
                  <Link to="/login" className="text-themecolor"> Login here</Link>
                </span>
              </div>  
            </div>
          </form>
      </div>
    </div>
  );
}

export default RegisterPage;
