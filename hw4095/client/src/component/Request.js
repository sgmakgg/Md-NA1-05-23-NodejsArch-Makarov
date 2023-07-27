import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import Item from "@mui/material/Unstable_Grid2";



const Request = ({reqName, reqMeth, cbCurrentRequestItem}) =>{
    const [reqKey, setReqKey] = useState(reqName);

    useEffect(() => {
        setReqKey(reqName)
    },[reqName]);

    const sendReqName = () =>{
        cbCurrentRequestItem(reqName);
    }

    return(
        <Item sx={{width:'100%'}}>
            <Button variant='text'
                    color = {reqMeth === 'GET' ? 'success' : 'error'}
                    size="large"
                    sx={{width:'100%'}}
                    onClick={sendReqName}
            >
                {reqKey}
            </Button>
        </Item>

    )
};

export default React.memo(Request);