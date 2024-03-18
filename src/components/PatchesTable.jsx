import {Tag,Flex,Button,Table,Typography,Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import axios from "axios";
import CreatePatch from "./CreatePatch";
const PatchesTable = (data) => {
    const columns = [
        {
          title: "SrNo",
          key: 'index', render: (value, record, index) =>index + 1 
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
          render: (actions) => (
            <>
              <Tag color={actions === "prod" ? "green" : "red"}>{actions}</Tag>
              {/* <Switch
                checked={status === "production"}
                onChange={(checked) => handleStatusChange(checked, dataIndex)}
              /> */}
            </>
          ),
        },
    ]
    //
    const {id}= data
    const [visible, setVisible] = useState(false);
    const handleOpenModal = () => setVisible(true);
    const handleCloseModal = () => setVisible(false);
    const [patches,setPatches] = useState([])
    const navigate = useNavigate();
    const getPatchesByBunddleId =async (id)=>{
      const token = localStorage.getItem("token");
      if(token){
        const {data}= await axios.get(`http://localhost:3000/patch/patchByBundle_Id/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        })
        setPatches(data)
      }else{
        navigate('/unauthorized')
      }
    }
    useEffect(() => {
      getPatchesByBunddleId(id)
    }, [])
    return (
        <Flex vertical='true' justify='center' style={{ marginTop: 20,marginBottom: 20,width: "80vh",padding:10}}>
          <Flex horizontal='true' justify="space-between">
            <Typography.Title level={4}>Patches</Typography.Title>
            <Button type="primary" onClick={handleOpenModal}>
              New Patch
              <PlusOutlined style={{marginLeft:8}}/>
            </Button>
          </Flex>
          <Table dataSource={patches} columns={columns} pagination={{ pageSize: 4 }}></Table>
          <Modal title="New Patch" open={visible} onCancel={handleCloseModal} okButtonProps={{style: {display: "none"}}} cancelButtonProps={{style: {display: "none"}}}>
            <CreatePatch id={id} onClose={handleCloseModal}/>
          </Modal>
        </Flex>
    )
}
export default PatchesTable;