import React from 'react'
import {Routes,Route,useNavigate} from 'react-router-dom';
import Login from "./pages/Login";
import Home from "./pages/Home";
import BundleDetail from './pages/BundleDetail';
import { Button, Result } from 'antd';
const App = () => {
  const navigate = useNavigate();
  const backToHome = ()=>{
    navigate('/auth')
  }
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<Login/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/details/:id" element={<BundleDetail/>}/>
        <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." extra={<Button type="primary" onClick={backToHome}>Back Home</Button>}/>}/>
        <Route path='/error' element={ <Result status="error" title="Bad Request" subTitle="Your request could not be processed due to invalid data or parameters." extra={<Button type="primary" onClick={backToHome}>Back Home</Button>}/>}/>
      </Routes>
    </div>
  )
}
export default App