import {Tag,Flex,Button,Table,Typography,Modal} from "antd";
import { DeleteFilled,PlusCircleFilled} from "@ant-design/icons";
import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom';
import axios from "axios";
import CreatePatch from "./CreatePatch";
const PatchesTable = ({data}) => {
    const columns = [
        {
          title: "SrNo",
          key: 'index', render: (value, record, index) =>index + 1 },
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
    //update_dateTime
    const {id}=useParams();
    console.log("id",id);
    const [visible, setVisible] = useState(false);
    const handleOpenModal = () => setVisible(true);
    const handleCloseModal = () => setVisible(false);
    const [patches,setPatches] = useState([])
    const getPatchesByBunddleId =async (id)=>{
      const {data}= await axios.get(`http://localhost:3000/patch/patchByBundle_Id/${id}`)
      console.log(data);
      setPatches(data)
    }
    useEffect(() => {
      getPatchesByBunddleId(id)
    }, [patches])
    return (
        <Flex vertical='true' justify='center' style={{ marginTop: 20,padding:20}}>
          <Flex horizontal='true' justify="space-between">
            <Typography.Title level={4}>Patches</Typography.Title>
            <Button onClick={handleOpenModal}>
              New Patch
              <PlusCircleFilled style={{ marginLeft: 2}}/>
            </Button>
          </Flex>
          <Table dataSource={patches} columns={columns} pagination={{ pageSize: 4 }}></Table>
          <Modal title="New Bundle" open={visible} onCancel={handleCloseModal}>
            <CreatePatch onClose={handleCloseModal}/>
          </Modal>
        </Flex>
    )
}
export default PatchesTable;