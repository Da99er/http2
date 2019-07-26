import React from 'react';
import PropTypes from 'prop-types';

import '@shared/style/fonts.scss';
import '@shared/style/reset.scss';
import '@shared/style/style.scss';

import S from './Wrapper.scss';

const getColor = (num) => `000000${num}`.slice(-6).replace('.', '');

const Wrapper = ({ count, children }) => (
    <div
        className={S.container}
        style={{backgroundColor: `#${getColor(count.count)}`}}
    >
        <div className={S.body} >
            {children}
        </div>
    </div>
);

Wrapper.propTypes = {
    count: PropTypes.object.isRequired,
    children: PropTypes.node,
};

export default Wrapper;
