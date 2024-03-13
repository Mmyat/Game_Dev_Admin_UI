import { useState } from "react";
import {Form,Input,Button,Select} from 'antd';
const CreateBundle = ({onClose}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: "Select Types",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // const newBundle = {name,type}
    // Handle form submission logic (e.g., send data to server)
    console.log('Form submitted:', formData);
    onClose(); // Close the form
    setFormData({name: "",type : "Select Types"})
  };
  return (
      <Form layout="vertical">            
        <Form.Item label="Name">
          <Input name="name" value={formData.name} onChange={handleChange}/>
        </Form.Item>
        <Form.Item label="Type">
          <Select value={formData.type} onChange={handleSelectChange} options={options}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            Save
          </Button>
        </Form.Item>
      </Form>
  );
}  

export default CreateBundle