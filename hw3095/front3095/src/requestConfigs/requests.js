const variantsEndpoint = 'http://localhost:3095/variants';
const statEndpoint = 'http://localhost:3095/stat';

const fetchConfigVariants={
    URL: variantsEndpoint,
    method: 'get',
    headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST'
    },
};

const fetchConfigStat={
    URL: statEndpoint,
    method: 'get',
    headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST'
    },
};

export const requests = [{resConfig: fetchConfigStat, propName: 'stats'},
                                                {resConfig: fetchConfigVariants, propName: 'variants'}];