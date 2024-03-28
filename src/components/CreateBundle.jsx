import { useState,useEffect } from "react";
import axios from "axios";
import {Form,Input,Button,Select,notification} from 'antd';
const CreateBundle = ({onClose,onSave,id}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: "Select Types",
    prod_patch_id : '',
    orientation : 'Select Orientation',
    index_fileName : ''
  });
  // const[bundleId,setBundleId] = useState('')
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSelectChange = (value) => {
    setFormData({ ...formData, type: value });
  };
  const handleOptionChange = (value) => {
    setFormData({ ...formData, orientation: value });
  };
  const handleClose = ()=>{
    onClose();
    setFormData({
      name: '',
      type: "Select Types",
      prod_patch_id : '',
      orientation : 'Select Orientation',
      index_fileName : ''
    })
  }
  const options = [
    { value: "web", label: "Web" },
    { value: "cocos", label: "Cocos" },
  ];
  const orientation_opts =[
    { value: "portrait ", label: "Portrait " },
    { value: "landscape", label: "Landscape" },
  ]
  const handleSubmit =async (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: ' ',
      type: "Select Types",
      prod_patch_id : ' ',
      orientation : 'Select Orientation',
      index_fileName : ' '
    })
    getData()
  };
  //
  const getData =async()=>{
    try{
    console.log("edit id",id);
    const token = localStorage.getItem("token");
    console.log(token);
    if(id !== ''&& token !==''){
      console.log("hello");
      const response= await axios.get(`http://localhost:3000/bundle/detailBundle/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const {data} = response.data; 
      console.log("data:",data);
      setFormData({
        name: data.name,
        type: data.type,
        prod_patch_id : data.prod_patch_id,
        orientation : data.orientation,
        index_fileName : data.index_fileName
      })
    }    
    else{
      console.log("New bundle create");
      setFormData({
        name: '',
        type: "Select Types",
        prod_patch_id : '',
        orientation : 'Select Orientation',
        index_fileName : ''
      })
    }}
    catch{
      console.log("New bundle create");
      setFormData({
        name: '',
        type: "Select Types",
        prod_patch_id : '',
        orientation : 'Select Orientation',
        index_fileName : ''
      })
    }
  }
  //bundle
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 28 },
      sm: { span: 14 },
    },
    // with :{
    //   xs : {width : '40vw'},
    //   sm : {width : '30vw'}
    // }
  };

  const buttonLayout = {
    wrapperCol :{
      xs:{offset: 14, span: 14},
      sm: {offset : 12, span: 14},
    }
  }

  useEffect(() => {
    // console.log("id data",id);
    // setBundleId(id)
    getData()
  },[id])
  return (
      <Form {...formItemLayout} style={{maxWidth: 600}}>            
        <Form.Item justify='center' align='center' rules={[{required: true, message: 'Please enter bundle name!'}]}>
          <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange}/>
        </Form.Item>
        <Form.Item justify='center' align='center' rules={[{required: true, message: 'Please select bundle type'}]}>
          <Select value={formData.type} onChange={handleSelectChange} options={options}/>
        </Form.Item>
        <Form.Item justify='center' align='center' rules={[{required: true, message: 'Please enter prod_patch_id!'}]}>
          <Input placeholder="Prod_Patch_Id" name="prod_patch_id" value={formData.prod_patch_id} onChange={handleChange}/>
        </Form.Item>
        <Form.Item justify='center' align='center'>
          <Select name="orientation" value={formData.orientation} onChange={handleOptionChange} options={orientation_opts}/>
        </Form.Item>
        <Form.Item justify='center' align='center'>
          <Input placeholder="Index_FileName" name="index_fileName" value={formData.index_fileName} onChange={handleChange}/>
        </Form.Item>
        <Form.Item {...buttonLayout}>
          <Button ghost type="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{marginLeft:"8px"}}>
           {id == null?"Save" : "Update"}
          </Button>
        </Form.Item>
      </Form>
  );
}  

export default CreateBundle;