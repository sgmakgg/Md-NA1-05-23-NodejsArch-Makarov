const variantsEndpoint = 'http://134.209.89.177:3095/variants';
const statEndpoint = 'http://134.209.89.177:3095/stat';
const voteEndpoint = 'http://134.209.89.177:3095/vote';

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

let fetchConfigVote={
    URL: voteEndpoint,
    method: 'post',
    headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Content-Type' : 'application/json'
    },
};

export const requests = [{resConfig: fetchConfigStat, propName: 'stats'},
                                                {resConfig: fetchConfigVariants, propName: 'variants'},
                                                {resConfig: fetchConfigVote, propName: 'vote'}];