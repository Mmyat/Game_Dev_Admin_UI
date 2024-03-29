import { useState,useEffect} from "react";
import {Link,useNavigate} from 'react-router-dom';
import {Tag,Space,Table,Modal,Button,Typography,Flex,notification,Spin,Form,Input,Select} from "antd";
import {PlusOutlined,EditOutlined} from "@ant-design/icons";
import axios from "axios";
const Home = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <>
          <Tag color={type === "cocos" ? "green" : "blue"}>{type}</Tag>
        </>
      ),
    },
    {
      title: "Prod_Patch_Id",
      dataIndex: "prod_patch_id",
      key: "prod_patch_id",
    },
    {
      title: "Dev_Patch_Id",
      dataIndex: "dev_patch_id",
      key: "dev_patch_id",
    },
    {
      title: "Orientation",
      dataIndex: "orientation",
      key: "orientation",
    },
    {
      title: "Index_FileName",
      dataIndex: "index_fileName",
      key: "index_fileName",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/details/${record.dev_patch_id}`}>Detail</Link>
          <EditOutlined style={{color :"#fa8c16"}} onClick={()=>handleEdit(record.dev_patch_id)}/>
          {/* <DeleteFilled style={{color :"#fa541c"}} onClick={()=>{}}/> */}
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(true);
  const [bundleList, setBundleList] = useState([]);
  const [id, setId] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [total, setTotal] = useState(0);
  const handleOpenModal = () => {
    setIsNew(true);
    setVisible(true);   
  }
  const [formData, setFormData] = useState({
    name: '',
    type: "Select Types",
    prod_patch_id : '',
    orientation : 'Select Orientation',
    index_fileName : ''
  });
  // const[bundleId,setBundleId] = useState('')
  const handleChange = (event) => {
    console.log("name",event.target.value);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSelectChange = (value) => {
    console.log("types",value);
    setFormData({ ...formData, type: value });
  };
  const handleOptionChange = (value) => {
    console.log("orient",value);
    setFormData({ ...formData, orientation: value });
  };
  const handleClose = ()=>{
    setVisible(false);    
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
  const navigate = useNavigate();
  const storeToken=(cname)=> {
    let name = cname + "=";
    let tk = document.cookie;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        const data = c.substring(name.length, c.length)
        localStorage.setItem("token",data);
        return data;
      }
    }
    return "";
  }
  //
  const getBundles = async()=>{   
    const token = localStorage.getItem("token");
    // console.log("token",token);
    if(token){
      const response = await axios.get(`http://localhost:3000/bundle/listBundle/${currentPage}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) 
      console.log(response.data);
      if(response.data.code == 200){  
        const {list} = response.data.data;
        const {total} = response.data.data;
        console.log("bundles",list);
        console.log("total",total);
        setTotal(total)    
        const dataList = list.map(item => ({ ...item, key: item.id }))
        setBundleList(dataList)
        setLoading(false);     
        setHasMoreData(list.total > currentPage * pageSize);     
      }else{
        navigate('/unauthorized')
      }     
    }else{
      navigate('/unauthorized')
    }
  } 
  //
  const saveNewBundle =async ()=>{
    try{
      console.log("save");
      console.log("form data",formData);
      const token = localStorage.getItem("token");
      if(formData.name !== '' && formData.orientation !== 'Select Orientation' && formData.type !== "Select Types" && formData.prod_patch_id !== '' && formData.index_fileName !==' '){
        const response=await axios.post("http://localhost:3000/bundle/createBundle",formData,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("code :",response.data.code);
        if(response.data.code == 200){ 
          setVisible(false)
          notification.success({
            message: 'Saved Successfully!',
            description: 'Your data has been saved.',
            duration: 1,
          })
          setFormData({
            name: ' ',
            type: "Select Types",
            prod_patch_id : ' ',
            orientation : 'Select Orientation',
            index_fileName : ' '
          })
          // getData()
        }else{
          throw new error;
        }       
      }else{
        setVisible(true);
        notification.error({
        message: 'Failed to save!',
        description: 'Please fill all fields!',
        duration: 1,
      })
      }
    }
    catch(error){
      setVisible(true);
      notification.error({
        message: 'Failed to save!',
        description: 'Something went wrong !',
        duration: 1,
      })
    }
  }
  //
  const handleEdit =async (BundleId)=>{
    try{
      setVisible(true);
      setIsNew(false);
      setId(BundleId);
      console.log("budleId",BundleId);
      const token = localStorage.getItem("token");
      console.log(token);
      if(token !==''){
        console.log("hello");
        const response= await axios.get(`http://localhost:3000/bundle/detailBundle/${BundleId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const {data} = response.data; 
        console.log("edit data:",response.data.code);
        if(response.data.code == 200){ 
          setFormData({
            name: data.name,
            type: data.type,
            prod_patch_id : data.prod_patch_id,
            orientation : data.orientation,
            index_fileName : data.index_fileName
          })
        }
        else{
          throw new Error;
        }
      }
      else{
        throw new Error;
      }
    }
    catch(error){
      setVisible(true);
      notification.error({
        message: 'Failed to save!',
        description: 'Something went wrong !',
        duration: 1,
      })
    }
  }
  //
  const editBundle =async()=>{
    try{
      // console.log("edit");
      console.log("edit");
      const token = localStorage.getItem("token");
      console.log("token",token);
      if(formData.name !== '' && formData.orientation !== '' && formData.type !== "Select Types" && formData.prod_patch_id !== '' && formData.index_fileName !==' '){
        const response=await axios.put(`http://localhost:3000/bundle/updateBundle/${id}`,formData,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // console.log(response.data);
        if(response.data.code == 200){ 
          setVisible(false)
          notification.success({
            message: 'Updated Successfully!',
            description: 'New bundle has been updated.',
            duration: 1,
          })
          setFormData({
            name: ' ',
            type: "Select Types",
            prod_patch_id : ' ',
            orientation : 'Select Orientation',
            index_fileName : ' '
          })
        }else{
          throw new error;
        }
      }else{
        setVisible(true);
        notification.error({
        message: 'Failed to update!',
        description: 'Please fill all fields!',
        duration: 1,
      })
      }
    }
    catch(error){
      setVisible(true);
      notification.error({
        message: 'Failed to update!',
        description: 'Something went wrong !',
        duration: 1,
      })
    }
  } 
  //
  const formItemLayout = {
    wrapperCol: {
      xs: { span: 40 },
      sm: { span: 24 },
    },
  };
  //
  const buttonLayout = {
    wrapperCol :{
      xs:{offset: 13, span: 14},
      sm: {offset : 13, span: 14},
    }
  }

  useEffect(() => {
    storeToken("AccessToken");
    getBundles();
  },[id,isNew,currentPage,formData])

  const handlePageChange = (page,pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <div>
      { loading ?(
        <Flex align="center" justify='center' style={{width:'100%',height:'100vh'}}> 
          <Spin/> 
        </Flex>) :
        (<Flex vertical='true' align="center" justify='center' style={{width:'100%'}}>
          <Flex vertical='true' justify="center" style={{marginTop:2}}>
            <Typography.Title level={3}>Bundles</Typography.Title>
            <Flex justify="flex-end" style={{margin :'5px', marginInlineStart:'1px'}}>
              <Button justify="flex-end" type="primary" onClick={handleOpenModal}>
                New Bundle
                <PlusOutlined style={{marginLeft: 8}}/>
              </Button>
            </Flex>
            <Table scroll={{x: true}} dataSource={bundleList} columns={columns} key={bundleList.id} pagination={{onChange: handlePageChange, current: currentPage,pageSize:pageSize,total : total,nextButtonDisabled: !hasMoreData}} style={{width: '80vw','@media (max-width: 768px)': {fontSize: '0.8rem'},'@media (max-width: 576px)': { fontSize: '0.7rem'},marginTop:5}}></Table>
            <Modal justify='center' align='center' width={400} open={visible} title={isNew ? "New Bundle" : "Edit Bundle"} onCancel={handleClose} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
              <Form {...formItemLayout}>            
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
                <Form.Item {...buttonLayout} justify='end'>
                  <Button ghost type="primary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={isNew ? saveNewBundle : editBundle} style={{marginLeft:"8px"}}>
                  {isNew ?"Save" : "Update"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Flex>
        </Flex>)
      }
    </div>
  );
};
export default Home;