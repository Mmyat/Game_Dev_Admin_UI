import {useEffect,useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom';
import {Typography,Button,Flex,Spin,notification} from 'antd';
import {RollbackOutlined} from "@ant-design/icons";
import BundleForm from '../components/BundleForm';
import PatchesTable from '../components/PatchesTable';
import axios from 'axios';
const BundleDetail = () => {
  const navigate = useNavigate();
  const [bundle, setBundle] = useState("");
  const [loading, setLoading] = useState(true);
  const {id}=useParams();
  const getBundleById =async(id)=>{
    try{
      const token = localStorage.getItem("token");
      if(token){
        const response= await axios.get(`http://localhost:3000/bundle/detailBundle/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const {data} = response.data;
        if(response.data.code === '200'){
          setBundle(data)
          setLoading(false)
        }else{
          notification.error({
            message: 'Failed to get budle details!',
            description: 'Something went wrong !',
            duration: 1,
          })
        }      
      }else{
        navigate('/unauthorized')
      } 
    }
    catch{
      navigate('/unauthorized')
    }   
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    getBundleById(id)
  }, [bundle])
  return (
    <div>
      { loading ?(
        <Flex align="center" justify='center' style={{width:'100%',height:'100vh'}}> 
          <Spin/> 
        </Flex>
      ) : 
        (
        <Flex vertical='true' justify='center'>
          <Flex justify="flex-start">
            <Button ghost align='flex-start' type="primary" icon={<RollbackOutlined/>} onClick={handleBackClick} style={{marginLeft: '40px',marginTop : '30px'}}>Back</Button>        
          </Flex>
          <Flex vertical='true' align='center' justify='center'>
            <Typography.Title level={4}>Bundle Details</Typography.Title>
            <BundleForm data={bundle}/>
            <PatchesTable id={id}/>
          </Flex>    
        </Flex>)
        }
    </div>
  )
}

export default BundleDetail;