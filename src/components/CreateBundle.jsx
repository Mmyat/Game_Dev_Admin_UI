import { useState } from "react";
import {Form,Input,Button,Select} from 'antd';
const CreateBundle = ({onClose,onSave}) => {
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
  const handleClose = ()=>{
    onClose();
    setFormData({
      name: '',
      type: "Select Types",
      prod_patch_id : '',
      orientation : '',
      index_fileName : ''
    })
  }
  const options = [
    { value: "web", label: "Web" },
    { value: "cocos", label: "Cocos" },
  ];
  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(formData.index_fileName !=='');  
      onSave(formData);
      setFormData({
        name: ' ',
        type: "Select Types",
        prod_patch_id : ' ',
        orientation : ' ',
        index_fileName : ' '
      })
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
        <Form.Item label="Name" rules={[{required: true, message: 'Please enter bundle name!'}]}>
          <Input name="name" value={formData.name} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="Type" rules={[{required: true, message: 'Please select bundle type'}]}>
          <Select value={formData.type} onChange={handleSelectChange} options={options}/>
        </Form.Item>
        <Form.Item label="Prod_Patch_Id" rules={[{required: true, message: 'Please enter prod_patch_id!'}]}>
          <Input name="prod_patch_id" value={formData.prod_patch_id} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="orientation">
          <Input name="orientation" value={formData.orientation} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="Index_FileName">
          <Input name="index_fileName" value={formData.index_fileName} onChange={handleChange}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 13, span: 16}}>
          <Button ghost type="primary" onClick={handleClose}>
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