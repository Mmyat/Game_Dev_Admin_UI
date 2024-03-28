import {useEffect,useState} from 'react';
import {Form,Input,Button,Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const CreatePatch = ({id,file,onFile,fileList, onFileList,onClose,onSave}) => {
  const [form] = Form.useForm();
  const [base64, setBase64] = useState(null);
  const [remark, setRemark] = useState('');
  const [patchId, setPatchId] = useState(null);
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
  // const handleRemove = (file) => {
  //   onFileList([]);
  // };
//  
  const handleClose = ()=>{
    onClose()
    setRemark('');
    onFile(null);
    onFileList([]);
    // setShowFile(false)
  }
  //
  const onBeforeUpload = (file) => {
    if (!file.type.includes('zip')) {
      console.log('Only ZIP files are allowed!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const getBase64 = async (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onloadend = () => {
      let base64String = reader.result;
      const prefixIndex = base64String.indexOf(';base64,');
      if (prefixIndex !== -1) {
        base64String = base64String.substring(prefixIndex + ';base64,'.length);
      }
      console.log("64:", base64String);
      setBase64(base64String);
    }
  };

  //handleFileChange
  const handleFileChange = async(event)=>{
    onFile(event.file)
    onFileList([event.file]);
    // setShowFile(true)
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
      console.log("hello save");
      onClose()
      setRemark('');
      // setShowFile(false)
      onFile(null);
      onFileList([]);
    } catch (error) {
      console.error('Upload error:', error);
      console.log("Upload failed!")
    }
  };

  const formItemLayout = {
    // labelCol: {
    //   xs: { span: 28 },
    //   sm: { span: 6 },
    // },
    wrapperCol: {
      xs: { span: 28 },
      sm: { span: 24 },
    },
  };
  
  const buttonLayout = {
    wrapperCol :{
      xs:{offset: 14, span: 14},
      sm: {offset: 14, span: 12},
    }
  }

  useEffect(() => {
    setPatchId(generateId());
  }, [remark]);
  return (
    <Form layout="vertical" name="basic" form={form} onFinish={handleUpload} {...formItemLayout} style={{ maxWidth: 600}} initialValues={{ remember: true }} autoComplete="off">            
        <Form.Item label="" justify='center' align='center'>
          <Input addonBefore="Patch_Id" value={patchId} onChange={(e) => setPatchId(e.target.value)} name="patch_id" readOnly/>
        </Form.Item>
        <Form.Item label="remark" justify='center' align='center'>
          <Input name="remark" value={remark} onChange={(e) => setRemark(e.target.value)}/>
        </Form.Item>
        <Form.Item label="File Upload" justify='center' align='center'>
          <Upload name="file" fileList={fileList} showUploadList={true} multiple={false} onChange={handleFileChange} beforeUpload={onBeforeUpload} onDrop={(e) => e.preventDefault()}>
            <Button icon={<UploadOutlined/>}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item justify='center' align='center' {...buttonLayout}>
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