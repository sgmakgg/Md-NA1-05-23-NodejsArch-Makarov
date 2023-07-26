import React, {useEffect, useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';
import Item from '@mui/material/Unstable_Grid2';

import './Main.css';
import Request from "./Request";
import RequestItem from "./RequestItem";

let defReq = [{name: 'default', url: 'https://www.host.com', method: '', parameters: {}, contentTypes:{}, body:''}];

const Main = () => {

    const [requests, setRequests] = useState(defReq);

    useEffect(()=>{

        let locRequests = localStorage.getItem('requests');

        if(locRequests !== null){
            setRequests(JSON.parse(locRequests));
        }
    },[]);


    return(
        <Grid className='MainPage'  container >
            <Grid className='RequestItems' xs={3} xl={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="top">

                {requests.map((item, index) => (
                    <Item key = {index}>
                        <Request reqName = {item.name} reqMeth = {item.method}></Request>
                    </Item>
                ))}

            </Grid>
            <Grid  container xs={9} xl={11}  rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{minHeight:'30vh'}}>

                    {/*{(requestItem !== null) && <RequestItem></RequestItem>}*/}
                    <RequestItem></RequestItem>

                <Grid className='Response' xs={12}>
                    <h1>Response</h1>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default React.memo(Main);