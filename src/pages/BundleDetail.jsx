import {useEffect,useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom';
import {Typography,Button,Flex} from 'antd';
import {RollbackOutlined} from "@ant-design/icons";
import BundleForm from '../components/BundleForm';
import PatchesTable from '../components/PatchesTable';
import axios from 'axios';
const BundleDetail = () => {
  const navigate = useNavigate();
  const [bundle, setBundle] = useState("");
  const {id}=useParams();
  const getBundleById =async(id)=>{
    const token = localStorage.getItem("token");
    if(token){
      const response= await axios.get(`http://localhost:3000/bundle/detailBundle/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const {data} = response.data;
      console.log("data",data);
      setBundle(data)
    }else{
      navigate('/unauthorized')
    }    
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    getBundleById(id)
  }, [])
  return (
    <Flex vertical='true' justify='center'>
      <Flex justify="flex-start">
        <Button ghost align='flex-start' type="primary" icon={<RollbackOutlined/>} onClick={handleBackClick} style={{marginLeft: '40px',marginTop : '30px'}}>Back</Button>        
      </Flex>
      <Flex vertical='true' align='center' justify='center'>
        <Typography.Title level={4}>Bundle Details</Typography.Title>
        <BundleForm data={bundle}/>
        <PatchesTable id={id}/>
      </Flex>    
    </Flex>
  )
}

export default BundleDetail;