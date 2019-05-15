import httpXHR from '@shared/utils/httpXHR';

const sameGraphQl = ({ method, params = {} }) => {

    if (method === 'GET') {

        return httpXHR({
            method,
            url: `/apiv1/same-graphql?params=${encodeURIComponent(JSON.stringify(params))}`,
        });

    }

    return httpXHR({
        method,
        url: '/apiv1/same-graphql',
        body: encodeURIComponent(JSON.stringify(params)),
    });

};

export default sameGraphQl;
