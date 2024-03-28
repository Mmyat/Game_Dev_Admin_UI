import {Space,Flex,Button,Table,Typography,Modal,notification,Popconfirm,Switch,Tag} from "antd";
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
          title: "Enviroment",
          dataIndex: "environment",
          key: "environment",
          render: (environment) => (
            <>
              <Tag color={environment === "production" ? "green" : "yellow"}>{environment}</Tag>
            </>)
        },
        {
          title: "Actions",
          dataIndex: "actions",
          key: "actions",
          render: (_, record) => (
            <>
              <Space size="middle">
                <Switch checked={record.environment === "production"} onClick={(checked) =>changeEnvironment(checked,record.id)}/>
                {/* <EditOutlined style={{color :"#fa8c16"}} onClick={()=>{}}/>                */}
                <Popconfirm title="Delete the task" description="Are you sure to delete this task?" onConfirm={()=>{deletePatch(record.id)}} onCancel={()=>{}} okText="Yes" cancelText="No">
                  <DeleteFilled style={{color :"#fa541c"}}/>
                </Popconfirm>
              </Space>
            </>
          ),
        },
    ]
    //
    const changeEnvironment =async(checked,patch_id)=>{
      try{
        const token = localStorage.getItem("token");
        const changedenv = await axios.get(`http://localhost:3000/patch/updateEnvironemnt/${patch_id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("res env",changedenv.data);
        if(changedenv.data.code == '200'){
          console.log("delete success");
          notification.success({
            message: 'update Successfully!',
            description: 'Your data has been updated.',
            duration: 2,
          })
          getPatchesByBunddleId(id)
          }else{
            throw error;
        }
      }
      catch(error){
        notification.error({
          message: 'Failed to update env!',
          description: 'Something went wrong !',
          duration: 2,
        })
      }
    }
    //
    const deletePatch =async (patch_id)=>{
      try{
        if(patch_id !== '' && patch_id !== null){
          const token = localStorage.getItem("token");
          console.log(id);
          const response = await axios.delete(`http://localhost:3000/patch/deletePatch/${patch_id}`,{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log("response1",response.data);
          if(response.data.code == '200'){
            console.log("delete success");
            getPatchesByBunddleId(id)
            // message.success('delete Successfully');
            notification.success({
              message: 'delete Successfully!',
              description: 'Your data has been deleted.',
              duration: 1,
            })
            }else{
              throw error;
          }
        }
        else{
          notification.error({
          message: 'Failed to delete!',
          description: 'Please fill all fields!',
          duration: 1,
        })
        }
      }catch(error){
        notification.error({
        message: 'Failed to delete!',
        description: 'Something went wrong !',
        duration: 1,
      })
      }
    }
    //
    const {id}= data
    const [visible, setVisible] = useState(false);
    const handleOpenModal = () => setVisible(true);
    const handleCloseModal = () =>{ 
      setVisible(false);
      setFile(null)
      setFileList([])
    }
    const [patches,setPatches] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [env,setEnv] = useState('')
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const getPatchesByBunddleId =async (id)=>{
      const token = localStorage.getItem("token");
      if(token){
        const response= await axios.get(`http://localhost:3000/patch/patchByBundle_Id/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const {list} = response.data.data;
        const {total} = response.data.data;
        if(response.data.code === '200'){
          console.log("patshes",list);
          setPatches(list)
          setTotal(total)
        }else{
          notification.error({
            message: 'Failed to get patches!',
            description: 'Something went wrong !',
            duration: 1,
          })
        }        
      }else{
        navigate('/unauthorized')
      }
    }
    const saveNewPatch=async(data)=>{
      try{
        console.log("data",data);
        if(data.bundle_id !== '' && data.patch_id !== '' && data.remark !== '' && data.file_PatchDecode !== ''){
          const token = localStorage.getItem("token");
          console.log("hello 123");
          const response = await axios.post('http://localhost:3000/patch/createPatch', data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });  
          const {code}= response.data      
          console.log("res",code);
          // const {data}= response.data
          setVisible(false)
          getPatchesByBunddleId(id)
          notification.success({
            message: 'Saved Successfully!',
            description: 'Your data has been saved.',
            duration: 1,
          })
        }
        else{
          setVisible(true);
          notification.error({
           message: 'Failed to save!',
            description: 'Please fill all fields!',
            duration: 1,
          })
        }
      }catch(error){
        setVisible(true);
        notification.error({
          message: 'Failed to save!',
          description: 'Something went wrong !',
          duration: 1,
      })
      }
    }

    const handlePageChange = (page,pageSize) => {
      setCurrentPage(page);
    };
    useEffect(() => {
      getPatchesByBunddleId(id)
    }, [env])
    return (
        <div style={{ marginTop: 20,marginBottom: 20,padding:10,}}>
          <Flex horizontal='true' justify="space-between">
            <Typography.Title level={4}>Patches</Typography.Title>
            <Button type="primary" onClick={handleOpenModal}>
              New Patch
              <PlusOutlined style={{marginLeft:8}}/>
            </Button>
          </Flex>
          <Table scroll={{x: true}}  dataSource={patches} columns={columns} total={total} rowKey="Id" pagination={{onChange: handlePageChange, current: currentPage,pageSize: pageSize}} style={{width: '80vw','@media (max-width: 768px)': {fontSize: '0.8rem'},'@media (max-width: 576px)': { fontSize: '0.7rem'}}}></Table>
          <Modal title="New Patch" justify='center' align='center' width={400}  open={visible} onCancel={handleCloseModal} okButtonProps={{style: {display: "none",marginLeft: "100px"}}} cancelButtonProps={{style: {display: "none"}}}>
            <CreatePatch id={id} file={file} fileList={fileList} onFile={setFile} onFileList={setFileList} onClose={handleCloseModal} onSave={saveNewPatch}/>
          </Modal>
        </div>
    )
}
export default PatchesTable;