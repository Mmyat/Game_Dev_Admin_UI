import React from "react";
import {Flex,Button,Typography} from 'antd';
import axios from 'axios';
const Login = () => {
  const loginProcess = async() => {
    const {data} = await axios.get("http://localhost:3000/login/googleLogin")
    console.log(data);
    window.location.href = data
  };
  return (
  <Flex vertical='true' align="center" justify='center' style={{marginBottom: 20,height: "100vh"}}>
    <Typography.Title level={4}> Game Dev Admin Tool</Typography.Title>
    <Button type="primary" onClick={loginProcess} style={{ marginTop: 20}}>
      Login with Google
    </Button>
  </Flex >
  );
};

export default Login;
