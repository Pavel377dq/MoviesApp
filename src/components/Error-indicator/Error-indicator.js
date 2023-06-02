import { Alert, Space } from 'antd';

function ErrorIndicator(props) {
 const { message, error } = props;

 return (
  <Space
   direction="vertical"
   style={{
    width: '100%',
    position: 'absolute',
   }}
  >
   <Alert message={error} description={message} type="error" />
  </Space>
 );
}
export default ErrorIndicator;
