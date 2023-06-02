import { Progress as Progr } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

function Progress({ percent, color }) {
 return (
  <Progr
   type="circle"
   strokeColor={color}
   percent={percent}
   format={() => `${(percent / 10).toFixed(1)}`}
   size={40}
  />
 );
}

Progress.defaultProps = {
 color: '',
 percent: 0,
};

Progress.propTypes = {
 color: PropTypes.string,
 percent: PropTypes.number,
};

export default Progress;
