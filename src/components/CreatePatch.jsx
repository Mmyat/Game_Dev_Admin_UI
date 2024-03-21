import {useEffect,useState} from 'react';
import {Form,Input,Button,Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const CreatePatch = ({id,onClose,onSave}) => {
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const [base64, setBase64] = useState(null);
  const [remark, setRemark] = useState('');
  const [patchId, setPatchId] = useState(null);
  const [showFile,setShowFile]= useState(true)
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
  //
  const handleClose = ()=>{
    onClose()
    setRemark('');
    setFile(null);
    setShowFile(!showFile)
  }
  //
  const onBeforeUpload = (file) => {
    if (!file.type.includes('zip')) {
      console.log('Only ZIP files are allowed!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const getBase64 =async (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onloadend = () => {       
      const base64String = reader.result;
      console.log("64:",base64String);
      setBase64(base64String);
    }
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  //handleFileChange
  const handleFileChange = async(event)=>{
    setFile(event.file)
    const reader = new FileReader();
    console.log("file:",file);
    console.log("reader",reader);
    if (file) {    
      getBase64(file, (result) => {
        console.log('result',result);
     });
    }
  }
  //
  const handleUpload = async () => {
    try {
      console.log(base64);
      const data = {
        bundle_id:id,
        patch_id : patchId,
        remark,
        file_Patch: base64,
      };
      onSave(data)
      onClose()
      setRemark('');
      setShowFile(!showFile)
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      console.log("Upload failed!")
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 28 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 28 },
      sm: { span: 18 },
    },
  };
  useEffect(() => {
    setPatchId(generateId());
  }, [ ]);
  return (
    <Form layout="vertical" name="basic" form={form} justify='center' onFinish={handleUpload} {...formItemLayout} style={{ maxWidth: 600}} initialValues={{ remember: true }} autoComplete="off">            
        <Form.Item label="">
          <Input addonBefore="Patch_Id" value={patchId} onChange={(e) => setPatchId(e.target.value)} name="patch_id"/>
        </Form.Item>
        <Form.Item label="remark">
          <Input name="remark" value={remark} onChange={(e) => setRemark(e.target.value)}/>
        </Form.Item>
        <Form.Item label="File Upload">
          <Upload name="file" onRemove={true} multiple={false} file={file} onChange={handleFileChange} beforeUpload={onBeforeUpload} onDrop={(e) => e.preventDefault()}>
            <Button icon={<UploadOutlined/>}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 11, span: 8}}>
          <Button ghost type="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={file=== null} style={{marginLeft:"8px"}}>
            Save
          </Button>
        </Form.Item>
      </Form>
  )
}

export default CreatePatch