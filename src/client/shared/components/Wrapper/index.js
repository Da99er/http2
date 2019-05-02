import { connect } from 'react-redux';

import Wrapper from './Wrapper';

const mapStateToProps = (state) => ({
    router: state.router,
    count: state['counter-number'],
});

export default connect(mapStateToProps, null)(Wrapper);
