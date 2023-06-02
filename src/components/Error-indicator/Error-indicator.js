import { Alert, Space } from 'antd';

function ErrorIndicator(props) {
 const {  error } = props;

 return (
  <Space
   direction="vertical"
   style={{
    width: '100%',
    position: 'relative',
   }}
  >
   <Alert message='Error' description='Movie not found' error={error} type="error" />
  </Space>
 );
}
export default ErrorIndicator;
