import {useEffect,useState} from 'react';
import {Form,Input,Button,Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
const CreatePatch = () => {
  const [fileList, setFileList] = useState([]);
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
  const Patch_Id= generateId();
  //
  const onChange = (info) => {
    setFileList(info.fileList);

    if (info.file.status === 'done') {
      console.log(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} upload failed`);
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
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append('file', file));

    try {
      const response = await axios.post('/your-api-endpoint', formData, {
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
    <Form layout="vertical" name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600,marginTop: 8 }}
    initialValues={{ remember: true }}
    autoComplete="off">            
        <Form.Item label="">
          <Input addonBefore="Patch_Id" value={Patch_Id}/>
        </Form.Item>
        <Form.Item label="File Upload">
          <Upload name="file" multiple={false} fileList={fileList} onChange={onChange} beforeUpload={onBeforeUpload} onDrop={(e) => e.preventDefault()}>
            <Button icon={<UploadOutlined/>}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button ghost type="primary" htmlType="submit">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleUpload} disabled={fileList.length === 0}>
            Save
          </Button>
        </Form.Item>
      </Form>
  )
}

export default CreatePatch