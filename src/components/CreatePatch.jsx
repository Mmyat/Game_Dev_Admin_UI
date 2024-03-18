import {useEffect,useState} from 'react';
import {Form,Input,Button,Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
const CreatePatch = (data) => {
  const [file, setFile] = useState([]);
  const [form] = Form.useForm();
  const [base64, setBase64] = useState(null);
  //
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
  const patch_id= generateId();
  const bundle_id = data.id
  //
  const onChange = (e) => {
    setFile(e.file);
    console.log(e.file.status);
    if (e.file.status === 'done') {
      console.log(`${e.file.name} uploaded successfully`);
    } else if (e.file.status === 'error') {
      console.log(`${e.file.name} upload failed`);
    }
  };
  //
  const onBeforeUpload = (file) => {
    if (!file.type.includes('zip')) {
      // messageApi.open({error:"Only ZIP files are allowed!"})
      // setTimeout(messageApi.destroy, 2500);
      console.log('Only ZIP files are allowed!');
      return Upload.LIST_IGNORE; // Prevent upload if not a zip file
    }
    return true; // Allow upload if it's a zip file
  };
  //
  const handleUpload = async (values) => {
    const {patch_id, remark, file}= values
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64(base64String);
        console.log(base64);
      }
    }
    
    const formData = new FormData();
    formData.append('bundle_id', bundle_id);
    formData.append('patch_id', patch_id);
    formData.append('remark', remark);
    formData.append('file_PatchDecode', file); 

    try {
      const response = await axios.post('http://localhost:3000/patch/createPatch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response:', response.data); // Process API response
      setFileList([]); // Clear file list after successful upload
      console.log('Files uploaded successfully!');
      // messageApi.open("Files uploaded successfully!")
      // setTimeout(messageApi.destroy, 2500);
    } catch (error) {
      console.error('Upload error:', error);
      // message.error('Upload failed!');
      console.log("Upload failed!")
      // setTimeout(messageApi.destroy, 2500);
    }
  };

  return (
    <Form layout="vertical" name="basic" form={form} onFinish={handleUpload} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600,marginTop: 8 }} initialValues={{ remember: true }} autoComplete="off">            
        <Form.Item label="">
          <Input addonBefore="Patch_Id" value={patch_id} name="patch_id"/>
        </Form.Item>
        <Form.Item label="remark">
          <Input name="remark"/>
        </Form.Item>
        <Form.Item label="File Upload">
          <Upload name="file" multiple={false} file={file} onChange={onChange} beforeUpload={onBeforeUpload} onDrop={(e) => e.preventDefault()}>
            <Button icon={<UploadOutlined/>}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button ghost type="primary">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={file.length === 0}>
            Save
          </Button>
        </Form.Item>
      </Form>
  )
}

export default CreatePatch