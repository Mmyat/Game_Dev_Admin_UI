import { useState,useEffect} from "react";
import {useParams,Link,useNavigate} from 'react-router-dom';
import {Tag,Space,Table,Modal,Button,Typography,Flex} from "antd";
import { DeleteFilled,PlusOutlined} from "@ant-design/icons";
import CreateBundle from "../components/CreateBundle";
import axios from "axios";
const Home = () => {
  //
  const columns = [
    {
      title: "SrNo",
      key: 'index', render: (value, record, index) =>index + 1
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
          <a><DeleteFilled /></a>
        </Space>
      ),
    },
  ];
  //index_fileName
  const handleStatusChange = (checked, dataIndex) => {
    // Update user status in state (replace with your actual logic)
    const updatedUsers = bundleList.map((user) => {
      if (user.id === dataIndex) {
        return { ...user, status: checked ? "production" : "development" };
      }
      return user;
    });
    setUsers(updatedUsers);
  };
  const {token}=useParams();
  const storeToken =async ()=>{
    await localStorage.setItem("token", token)
  }
  const [loading, setLoading] = useState(false);
  const [bundleList, setBundleList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);
  const handleOpenModal = () => setVisible(true);
  const handleCloseModal = () => setVisible(false);
  const navigate = useNavigate();
  const getBundles = async()=>{
    const token = localStorage.getItem("token");
    console.log("token",token);
    if(token){
      const response = await axios.get(`http://localhost:3000/bundle/listBundle/${currentPage}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) 
      console.log(response.status);
      if(response.status == 200){
        // navigate('/unauthorized')
        const {data} = response;
        console.log("data",data);
        setBundleList(data)     
        setHasMoreData(data.total > currentPage * pageSize);     
      }else{
        navigate('/unauthorized')
      }     
    }else{
      navigate('/unauthorized')
    }
  }  
  useEffect(() => {
    storeToken();
    getBundles();
  },[currentPage, pageSize])
  const handlePageChange = (page,pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <Flex vertical='true' align="center" justify='center' >
      <Flex vertical='true' justify="center" style={{ marginTop:2}}>
        <Typography.Title level={3}>Bundles</Typography.Title>
        <Flex justify="flex-end" style={{margin :'5px', marginInlineStart:'1px'}}>
          <Button justify="flex-end" type="primary" onClick={handleOpenModal}>
            New Bundle
            <PlusOutlined style={{marginLeft: 8}}/>
          </Button>
        </Flex>
        <Table dataSource={bundleList} columns={columns} pagination={{onChange: handlePageChange, current: currentPage,pageSize:8,nextButtonDisabled: !hasMoreData}} style={{marginTop:5,padding:10}}></Table>
        <Modal  title="New Bundle" open={visible} onCancel={handleCloseModal} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
          <CreateBundle onClose={handleCloseModal}/>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default Home;
