import { connect } from 'react-redux';

import { additiveCount } from 'shared/actions/counter-number';

import NotFound from './NotFound';

const mapStateToProps = (state) => ({
    count: state['counter-number'],
    allMenus: state['menu-items'],
    siteOptions: state['site-options'],
    router: state.router,
});

const mapDispatchToProps = {
    additiveCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
