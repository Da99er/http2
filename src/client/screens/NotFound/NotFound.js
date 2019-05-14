import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import sameGraphQl from '@shared/utils/sameGraphQl';
import replaceMaskToLocation from '@shared/utils/replaceMaskToLocation';

import Wrapper from '@shared/components/Wrapper';

import S from '@shared/style/post.scss';
import S1 from '@shared/style/index.scss';

export default class NotFound extends Component {

    static propTypes = {
        // name: PropTypes.string,
    };

    state = {
        isLoading: false,
    }

    componentDidMount() {

        this.fetchData();

    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.props.location !== nextProps.location) {

            this.fetchData();

        }

        return this.state.isLoading !== nextState.isLoading;

    }

    render() {

        // console.log('@>NotFound', this.props);

        const { count } = this.props;

        return (
            <Wrapper>
                <div className={S1.leftContainer}>
                    <h1 className={S.title_h1} >
                        {'Not Found'}
                    </h1>
                    <div className={S.content}>
                        <div className={S.text}>
                            {'Not Found page text'}

                        </div>
                        <button onClick={this.handleCounter}>
                            {`add count ${count.count}`}
                        </button>
                    </div>
                </div>
            </Wrapper>
        );

    }

    handleCounter = () => {

        const { additiveCount } = this.props;

        this.setState({
            isLoading: true,
        }, () => {

            sameGraphQl({
                method: 'GET',
                params: {
                    'counter-number': { choosen: 3 },
                },
            })
                .then((res) => {

                    additiveCount(res['counter-number'].count);

                    this.setState({
                        isLoading: false,
                    });

                })
                .catch((err) => {

                    console.error(err); // eslint-disable-line no-console

                    this.setState({
                        isLoading: false,
                    });

                });

        });

    }

    fetchData() {

        const { fetchPreloadData, additiveCount, match } = this.props;

        this.setState({
            isLoading: true,
        }, () => {

            sameGraphQl({
                method: 'GET',
                params: replaceMaskToLocation(fetchPreloadData, match.params),
            })
                .then((res) => {

                    additiveCount(res['counter-number'].count);

                    this.setState({
                        isLoading: false,
                    });

                })
                .catch((err) => {

                    console.error(err); // eslint-disable-line no-console

                    this.setState({
                        isLoading: false,
                    });

                });

        });

    }

}
