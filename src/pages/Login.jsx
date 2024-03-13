import React from "react";
import { useNavigate } from "react-router-dom";
import {Flex,Button,Typography} from 'antd';
import axios from 'axios';
const Login = () => {
  const navigate = useNavigate();
  const loginProcess = async() => {
    const {data} = await axios.get("http://localhost:3000/login/googleLogin")
    const {url} = data
    // const login = await axios.get(url)
    window.location.href = url
    console.log(url);
    setTimeout(() => {
      console.log("this is waiting to navigate");
    }, 3000);
    navigate("/");
  };
  return (
  <Flex vertical='true' align="center" justify='center' style={{marginBottom: 20,height: "100vh"}}>
    <Typography.Title level={4}> Game Dev Admin Tool</Typography.Title>
    <Button type="primary" onClick={loginProcess}>
      Login with Google
    </Button>
  </Flex >
  );
};

export default Login;
