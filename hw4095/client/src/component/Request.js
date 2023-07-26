import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";



const Request = ({reqName, reqMeth}) =>{
    const [reqKey, setReqKey] = useState(reqName);

    useEffect(() => {
        setReqKey(reqName)
    },[reqName]);

    return(
        <Button variant='text'
                color = {reqMeth === 'GET' ? 'success' : 'error'}
                size="large"
                style={{width:'8vw'}}
        >
            {reqKey}
        </Button>
    )
};

export default React.memo(Request);