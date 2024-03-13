import { Form, Input, Typography} from 'antd';
const BundleForm = ({data}) => {
    const {name,type,prod_patch_id,dev_patch_id,orientation,index_fileName} = data;
    return (
        <Form layout="vertical" className='items-center w-2/3 md:w-2/5 mx-auto'>
            <Typography.Title level={4}>{name}</Typography.Title>
            <Form.Item label="Name" className='mb-1'>
                <Input value={name} readOnly /> 
            </Form.Item>
            <Form.Item label="Type" className='mb-1'>
                <Input value={type} readOnly /> 
            </Form.Item>
            <Form.Item label="Prod_Patch_Id" className='mb-1'>
                <Input value={prod_patch_id} readOnly /> 
            </Form.Item>    
            <Form.Item label="Dev_Patch_Id" className='mb-1'>
                <Input value={dev_patch_id} readOnly /> 
            </Form.Item>
            <Form.Item label="Orientation" className='mb-1'>
                <Input value={orientation} readOnly /> 
            </Form.Item>
            <Form.Item label="Index_FileName" className='mb-1'>
                <Input value={index_fileName} readOnly /> 
            </Form.Item>
        </Form>
    )
}

export default BundleForm