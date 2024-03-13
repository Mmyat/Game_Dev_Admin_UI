import { useState,useEffect} from "react";
import { Link} from 'react-router-dom';
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

  const [loading, setLoading] = useState(false);
  const [bundleList, setBundleList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);
  const handleOpenModal = () => setVisible(true);
  const handleCloseModal = () => setVisible(false);

  const getBundles = async()=>{
    const {data} = await axios.get(`http://localhost:3000/bundle/listBundle/${currentPage}`)
    const bundles = data
    console.log(bundles);
    setBundleList(bundles)
    setHasMoreData(data.total > currentPage * pageSize);
  }
  useEffect(() => {
    getBundles();
  },[currentPage, pageSize])
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize); // Update page and size if needed
  };
  return (
    <>
      <Flex vertical='true' justify="center" style={{ marginTop: 30,padding:20}}>
        <Flex horizontal='true' justify="space-between">
          <Typography.Title level={4}>Bundles</Typography.Title>
          <Button type="primary" onClick={handleOpenModal}>
            New Bundle
            <PlusOutlined style={{ fontSize: '20px'}}/>
          </Button>
        </Flex>
        <Table dataSource={bundleList} columns={columns} pagination={{onChange: handlePageChange, current: currentPage,pageSize:8,nextButtonDisabled: !hasMoreData}} ></Table>
        {/* Popup input form */}
        <Modal title="New Bundle" open={visible} onCancel={handleCloseModal}>
          <CreateBundle onClose={handleCloseModal}/>
        </Modal>
      </Flex>
    </>
  );
};

export default Home;
