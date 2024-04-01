import {Space,Flex,Button,Table,Typography,Modal,notification,Popconfirm,Switch,Tag,Form,Input,Upload} from "antd";
import { PlusOutlined, DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const PatchesTable = (data) => {
  const pageSize = 4;
  const columns = [
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
          <Tag color={environment === "production" ? "green" : "yellow"}>
            {environment}
          </Tag>
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Space size="middle">
            <Switch
              checked={record.environment === "production"}
              onClick={(checked) => changeEnvironment(checked, record.id)}
            />
            {/* <EditOutlined style={{color :"#fa8c16"}} onClick={()=>{}}/>                */}            
              <DeleteFilled style={{ color: "#fa541c" }} onClick={()=>showModal(record.id)}/>           
          </Space>
        </>
      ),
    },
  ];
  //Delete Comfirm handle
  const showModal = (delete_id) => {
    console.log("delete",delete_id);
    setDeleteId(delete_id);
    setIsTapDelete(true);
  };
  const handleOk = () => {
    deletePatch(deleteId)
    setIsTapDelete(false);
  };
  const handleCancel = () => {
    setIsTapDelete(false);
  };

  //Env change handle
  const changeEnvironment = async (checked, patch_id) => {
    try {
      const token = localStorage.getItem("token");
      console.log("pat tok",token);
      console.log("id",patch_id);
      const changedenv = await axios.get(
        `http://localhost:3000/patch/updateEnvironment/${patch_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("env",changedenv);
      if (changedenv.data.code == "200") {
        notification.success({
          message: "update Successfully!",
          description: "Your data has been updated.",
          duration: 2,
        });
        getPatchesByBunddleId(id);
      } else {
        throw error;
      }
    } catch (error) {
      notification.error({
        message: "Failed to update env!",
        description: "Something went wrong !",
        duration: 2,
      });
    }
  };
  //
  const deletePatch = async (patch_id) => {
    try {
      if (patch_id !== "" && patch_id !== null) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:3000/patch/deletePatch/${patch_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.code == "200") {
          console.log("delete success");
          getPatchesByBunddleId(id);
          // message.success('delete Successfully');
          notification.success({
            message: "delete Successfully!",
            description: "Your data has been deleted.",
            duration: 1,
          });
        } else {
          throw error;
        }
      } else {
        notification.error({
          message: "Failed to delete!",
          description: "Please fill all fields!",
          duration: 1,
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to delete!",
        description: "Something went wrong !",
        duration: 1,
      });
    }
  };
  //
  const { id } = data;
  const [visible, setVisible] = useState(false);
  const handleOpenModal = () =>{ 
    setVisible(true);
    setPatchId(generateId);
  }
  const handleCloseModal = () => {
    setVisible(false);
    setFile(null);
    setRemark("");
    setFileList([]);
    setWarning('')
  };
  const [patches, setPatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [env, setEnv] = useState("");
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [base64, setBase64] = useState(null);
  const [remark, setRemark] = useState("");
  const [patchId, setPatchId] = useState(null);
  const [warning,setWarning] = useState("")
  const [isTapDelete, setIsTapDelete] = useState(false);
  const [deleteId,setDeleteId] = useState('')
  //
  const generateId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };
  //
  const onBeforeUpload = (file) => {
    if (!file.type.includes("zip")) {
      console.log("Only ZIP files are allowed!");
      setWarning("Only ZIP files are allowed!")
      return Upload.LIST_IGNORE;
    }
    setWarning('')
    return true;
  };

  const getBase64 = async (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onloadend = () => {
      let base64String = reader.result;
      const prefixIndex = base64String.indexOf(";base64,");
      if (prefixIndex !== -1) {
        base64String = base64String.substring(prefixIndex + ";base64,".length);
      }
      console.log("64:", base64String);
      setBase64(base64String);
    };
  };

  //handleFileChange
  const handleFileChange = async (event) => {
    setFile(event.file);
    setFileList([event.file]);
    // setShowFile(true)
    const reader = new FileReader();
    console.log("file:", file);
    console.log("reader", reader);
    if (file) {
      getBase64(file, (result) => {
        console.log("result", result);
      });
    }
  };

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 28 },
      sm: { span: 24 },
    },
  };

  const buttonLayout = {
    wrapperCol: {
      xs: { offset: 14, span: 14 },
      sm: { offset: 14, span: 12 },
    },
  };
  const getPatchesByBunddleId = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(
        `http://localhost:3000/patch/patchByBundle_Id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { list } = response.data.data;
      const { total } = response.data.data;
      if (response.data.code === "200") {
        console.log("patshes", list);
        setPatches(list);
        setTotal(total);
      } else {
        notification.error({
          message: "Failed to get patches!",
          description: "Something went wrong !",
          duration: 1,
        });
      }
    } else {
      navigate("/unauthorized");
    }
  };
  const saveNewPatch = async () => {
    try {
      const data = {
        bundle_id: id,
        patch_id: patchId,
        remark,
        file_Patch: base64,
      };
      console.log("data", data);
      if (
        data.bundle_id !== "" &&
        data.patch_id !== "" &&
        data.remark !== "" &&
        data.file_PatchDecode !== ""
      ) {
        const token = localStorage.getItem("token");
        console.log("hello 123");
        const response = await axios.post(
          "http://localhost:3000/patch/createPatch",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { code } = response.data;
        if(code == 200){
          getPatchesByBunddleId(id);
          notification.success({
            message: "Saved Successfully!",
            description: "Your data has been saved.",
            duration: 1,
          });
          handleCloseModal();
        }else{
          throw new Error;
        }        
      } else {
        setVisible(true);
        notification.error({
          message: "Failed to save!",
          description: "Please fill all fields!",
          duration: 1,
        });
      }
    } catch (error) {
      setVisible(true);
      notification.error({
        message: "Failed to save!",
        description: "Something went wrong !",
        duration: 1,
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    getPatchesByBunddleId(id);
  }, [env]);
  return (
    <div style={{ marginTop: 20, marginBottom: 20, padding: 10 }}>
      <Flex horizontal="true" justify="space-between">
        <Typography.Title level={4}>Patches</Typography.Title>
        <Button type="primary" onClick={handleOpenModal}>
          New Patch
          <PlusOutlined style={{ marginLeft: 8 }} />
        </Button>
      </Flex>
      <Table scroll={{ x: true }} dataSource={patches} columns={columns} total={total} rowKey="Id" pagination={{ onChange: handlePageChange, current: currentPage, pageSize: pageSize}} style={{width: "80vw","@media (max-width: 768px)": { fontSize: "0.8rem" },"@media (max-width: 576px)": { fontSize: "0.7rem" }}}></Table>
      <Modal title="Delete Patch" open={isTapDelete} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure to delete this patch?</p>
      </Modal>
      <Modal title="New Patch" justify="center" align="center" width={400} open={visible} onCancel={handleCloseModal} okButtonProps={{ style: { display: "none", marginLeft: "100px" } }} cancelButtonProps={{ style: { display: "none" } }}>
        <Form layout="vertical" name="basic" form={form} onFinish={saveNewPatch} {...formItemLayout} style={{ maxWidth: 600}} initialValues={{ remember: true }} autoComplete="off">            
          <Form.Item label="" justify='center' align='center'>
            <Input addonBefore="Patch_Id" value={patchId} onChange={(e) => setPatchId(e.target.value)} name="patch_id" readOnly/>
          </Form.Item>
          <Form.Item label="remark" justify='center' align='center'>
            <Input name="remark" value={remark} onChange={(e) => setRemark(e.target.value)}/>
          </Form.Item>
          <Form.Item label="File Upload" justify='center' align='center'>
            <p style={{color: 'red'}}>{warning}</p>
            <Upload name="file" fileList={fileList} showUploadList={true} multiple={false} onChange={handleFileChange} beforeUpload={onBeforeUpload} onDrop={(e) => e.preventDefault()}>
              <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item justify='center' align='center' {...buttonLayout}>
            <Button ghost type="primary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" disabled={file=== null} style={{marginLeft:"8px"}}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default PatchesTable;
