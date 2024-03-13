import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom';
import BundleForm from '../components/BundleForm';
import PatchesTable from '../components/PatchesTable';
import axios from 'axios';
const BundleDetail = () => {
  const [bundle, setBundle] = useState("");
  const {id}=useParams();
  const getBundleById =async(id)=>{
    const {data}= await axios.get(`http://localhost:3000/bundle/detailBundle/${id}`)
    setBundle(data)
  }

  useEffect(() => {
    getBundleById(id)
  }, [bundle])
  return (
    <div>
      <BundleForm data={bundle}/>
      <PatchesTable data={id}/>
    </div>
  )
}

export default BundleDetail;