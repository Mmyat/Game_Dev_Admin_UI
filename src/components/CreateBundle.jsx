import { useState } from "react";
import {Form,Input,Button,Select} from 'antd';
import axios from "axios";
const CreateBundle = ({onClose}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: "Select Types",
    prod_patch_id : '',
    orientation : '',
    index_fileName : ''
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSelectChange = (value) => {
    setFormData({ ...formData, type: value });
  };
  const options = [
    { value: "web", label: "Web" },
    { value: "cocos", label: "Cocos" },
  ];
  const handleSubmit =async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log('Form submitted:', formData);
    const response=await axios.post("http://localhost:3000/bundle/createBundle",formData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    onClose(); // Close the form
    setFormData({name: "",type : "Select Types"})
  };
  //
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  return (
      <Form {...formItemLayout} style={{ maxWidth: 600}}>            
        <Form.Item label="Name" rules={[{required: true, message: 'Please enter your name!' }]}>
          <Input name="name" value={formData.name} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="Type">
          <Select value={formData.type} onChange={handleSelectChange} options={options}/>
        </Form.Item>
        <Form.Item label="Prod_Patch_Id">
          <Input name="prod_patch_id" value={formData.prod_patch_id} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="orientation">
          <Input name="orientation" value={formData.orientation} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="Index_FileName">
          <Input name="index_fileName" value={formData.index_fileName} onChange={handleChange}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 13, span: 16}}>
          <Button ghost type="primary" onClick={()=>onClose()}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{marginLeft:"8px"}}>
            Save
          </Button>
        </Form.Item>
      </Form>
  );
}  

export default CreateBundle