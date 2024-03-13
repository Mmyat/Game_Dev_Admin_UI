import React from 'react'
import {Form,Input,Button,Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const CreatePatch = () => {
  const generateId=()=>{
    const date = new Date();
    const year = date.getFullYear().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  const Patch_Id= generateId();
  return (
    <Form layout="vertical" style={{ marginTop: 8}}>            
        <Form.Item label="">
          <Input addonBefore="Patch_Id" value={Patch_Id}/>
        </Form.Item>
        <Form.Item label="File Upload">
          <Upload>
            <Button icon={<UploadOutlined/>}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={()=>{}}>
            Save
          </Button>
        </Form.Item>
      </Form>
  )
}

export default CreatePatch