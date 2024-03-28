import { useState,useEffect} from "react";
import {Link,useNavigate} from 'react-router-dom';
import {Tag,Space,Table,Modal,Button,Typography,Flex,notification,Spin } from "antd";
import { DeleteFilled,PlusOutlined,EditOutlined} from "@ant-design/icons";
import CreateBundle from "../components/CreateBundle";
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
  const handleCloseModal = () => setVisible(false);
  const navigate = useNavigate();
  const storeToken=(cname)=> {
    let name = cname + "=";
    let tk = document.cookie;
    console.log("tk",tk);
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
    console.log("token",token);
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
  const saveNewBundle =async (formData)=>{
    try{
      const token = localStorage.getItem("token");
      if(formData.name !== '' && formData.orientation !== '' && formData.type !== "Select Types" && formData.prod_patch_id !== '' && formData.index_fileName !==' '){
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
      // e.preventDefault();
      // console.log("edit id",BundleId);
      setVisible(true);
      setIsNew(false);
      setId(BundleId)
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
  const editBundle =async(formData)=>{
    try{
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

  useEffect(() => {
    storeToken("AccessToken");
    getBundles();
  },[id,isNew,currentPage])
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
            <Modal justify='center' align='center' open={visible} title={isNew ? "New Bundle" : "Edit Bundle"} onCancel={handleCloseModal} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
              <CreateBundle onClose={handleCloseModal} id={isNew ?null : id} onSave={isNew ? saveNewBundle : editBundle}/>
            </Modal>
          </Flex>
        </Flex>)
      }
    </div>
  );
};
export default Home;