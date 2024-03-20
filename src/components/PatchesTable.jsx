import {Space,Flex,Button,Table,Typography,Modal,notification,Popconfirm} from "antd";
import {PlusOutlined,DeleteFilled,EditOutlined} from "@ant-design/icons";
import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import CreatePatch from "./CreatePatch";
const PatchesTable = (data) => {
  const pageSize = 4
    const columns = [
        {
          title: "SrNo",
          key: 'index', render: (value, record, index) =>(currentPage - 1) * pageSize + index + 1
        },
        {
          title: "Date",
          dataIndex: "update_dateTime",
          key: "update_dateTime",
        },
        {
          title: "Patch_Id",
          dataIndex: "patch_id",
          key: "patch_id",
        },
        {
          title: "Remark",
          dataIndex: "remark",
          key: "remark",
        },
        {
          title: "Actions",
          dataIndex: "actions",
          key: "actions",
          render: (_, record) => (
            <>
              <Space size="middle">
                <EditOutlined style={{color :"#fa8c16"}} onClick={()=>{}}/>               
                <Popconfirm title="Delete the task" description="Are you sure to delete this task?" onConfirm={()=>{deletePatch(record.id)}} onCancel={()=>{}} okText="Yes" cancelText="No">
                  <DeleteFilled style={{color :"#fa541c"}}/>
                </Popconfirm>
              </Space>
            </>
          ),
        },
    ]
    //
    const deletePatch =async (id)=>{
      try{
        if(id !== '' && id !== null){
          const token = localStorage.getItem("token");
          console.log(id);
          const response = await axios.delete(`http://localhost:3000/patch/deletePatch/${id}`,{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log("response1",response);
          message.success('delete Successfully');
          notification.success({
            message: 'delete Successfully!',
            description: 'Your data has been saved.',
          })
        }
        else{
          notification.error({
          message: 'Failed to delete!',
          description: 'Please fill all fields!',})
        }
      }catch(error){
        notification.error({
        message: 'Failed to delete!',
        description: 'Something went wrong !',
      })
      }
    }
    //
    const {id}= data
    const [visible, setVisible] = useState(false);
    const handleOpenModal = () => setVisible(true);
    const handleCloseModal = () => setVisible(false);
    const [patches,setPatches] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const getPatchesByBunddleId =async (id)=>{
      const token = localStorage.getItem("token");
      if(token){
        const response= await axios.get(`http://localhost:3000/patch/patchByBundle_Id/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        })
        const {data} = response.data;
        console.log("patshes",data);
        setPatches(data)
      }else{
        navigate('/unauthorized')
      }
    }
    const saveNewPatch=async(data)=>{
      try{
        if(data.bundle_id !== '' && data.patch_id !== '' && data.remark !== '' && data.file_PatchDecode !== ''){
          const token = localStorage.getItem("token");
          const response = await axios.post('http://localhost:3000/patch/createPatch', data, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setVisible(false)
          notification.success({
            message: 'Saved Successfully!',
            description: 'Your data has been saved.',
          })
        }
        else{
          setVisible(true);
          notification.error({
          message: 'Failed to save!',
          description: 'Please fill all fields!',})
        }
      }catch(error){
        setVisible(true);
        notification.error({
        message: 'Failed to save!',
        description: 'Something went wrong !',
      })
      }
    }

    const handlePageChange = (page,pageSize) => {
      setCurrentPage(page);
    };
    useEffect(() => {
      getPatchesByBunddleId(id)
    }, [visible])
    return (
        <Flex vertical='true' justify='center' style={{ marginTop: 20,marginBottom: 20,width: "80vh",padding:10}}>
          <Flex horizontal='true' justify="space-between">
            <Typography.Title level={4}>Patches</Typography.Title>
            <Button type="primary" onClick={handleOpenModal}>
              New Patch
              <PlusOutlined style={{marginLeft:8}}/>
            </Button>
          </Flex>
          <Table dataSource={patches} columns={columns} rowKey="Id" pagination={{onChange: handlePageChange, current: currentPage,pageSize: pageSize}}></Table>
          <Modal title="New Patch" open={visible} onCancel={handleCloseModal} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
            <CreatePatch id={id} onClose={handleCloseModal} onSave={saveNewPatch}/>
          </Modal>
        </Flex>
    )
}
export default PatchesTable;