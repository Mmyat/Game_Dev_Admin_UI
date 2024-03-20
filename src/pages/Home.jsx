import { useState,useEffect} from "react";
import {Link,useNavigate} from 'react-router-dom';
import {Tag,Space,Table,Modal,Button,Typography,Flex,notification} from "antd";
import { DeleteFilled,PlusOutlined} from "@ant-design/icons";
import CreateBundle from "../components/CreateBundle";
import axios from "axios";
const Home = () => {
  //
  const columns = [
    {
      title: "SrNo",
      key: 'index', render: (value, record, index) =>(currentPage - 1) * pageSize + index + 1
    },
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
          {/* <Switch
            checked={status === "production"}
            onChange={(checked) => handleStatusChange(checked, dataIndex)}
          /> */}
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
          <DeleteFilled style={{color :"#fa541c"}} onClick={()=>{}}/>
        </Space>
      ),
    },
  ];
  //index_fileName
  // const handleStatusChange = (checked, dataIndex) => {
  //   const updatedUsers = bundleList.map((user) => {
  //     if (user.id === dataIndex) {
  //       return { ...user, status: checked ? "production" : "development" };
  //     }
  //     return user;
  //   });
  //   setUsers(updatedUsers);
  // };
  const [loading, setLoading] = useState(false);
  const [bundleList, setBundleList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);
  const handleOpenModal = () => setVisible(true);
  const handleCloseModal = () => setVisible(false);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(`100%`);
  const storeToken=(cname)=> {
    let name = cname + "=";
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
  const getBundles = async()=>{
    const token = localStorage.getItem("token");
    if(token){
      const response = await axios.get(`http://localhost:3000/bundle/listBundle/${currentPage}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) 
      const {data} = response.data;
      if(response.data.code == 200){      
        const dataList = data.map(item => ({ ...item, key: item.id }))
        setBundleList(dataList)     
        setHasMoreData(data.total > currentPage * pageSize);     
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
        if(response.data.code == 200){ 
          setVisible(false)
          notification.success({
            message: 'Saved Successfully!',
            description: 'Your data has been saved.',
          })
        }else{
          throw new error;
        }
        
      }else{
        setVisible(true);
        notification.error({
        message: 'Failed to save!',
        description: 'Please fill all fields!',
      })
      }
    }
    catch(error){
      setVisible(true);
      notification.error({
        message: 'Failed to save!',
        description: 'Something went wrong !',
      })
    }
  } 
  useEffect(() => {
    window.addEventListener('resize',()=>setWindowWidth(`100%`))
    window.removeEventListener('resize',()=>setWindowWidth(`100%`))
    storeToken("AccessToken");
    console.log(window.innerWidth);
    getBundles();
  },[windowWidth,currentPage, pageSize])
  const handlePageChange = (page,pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <Flex vertical='true' align="center" justify='center'>
      <Flex vertical='true' justify="center" style={{marginTop:2}}>
        <Typography.Title level={3}>Bundles</Typography.Title>
        <Flex justify="flex-end" style={{width: windowWidth,margin :'5px', marginInlineStart:'1px'}}>
          <Button justify="flex-end" type="primary" onClick={handleOpenModal}>
            New Bundle
            <PlusOutlined style={{marginLeft: 8}}/>
          </Button>
        </Flex>
        <Table dataSource={bundleList} columns={columns} key={bundleList.id} pagination={{onChange: handlePageChange, current: currentPage,pageSize:8,nextButtonDisabled: !hasMoreData}} style={{width: windowWidth,'@media (max-width: 768px)': {fontSize: '0.8rem'},'@media (max-width: 576px)': { fontSize: '0.7rem'},marginTop:5}}></Table>
        <Modal  title="New Bundle" open={visible} onCancel={handleCloseModal} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
          <CreateBundle onClose={handleCloseModal} onSave={saveNewBundle}/>
        </Modal>
      </Flex>
    </Flex>
  );
};
export default Home;