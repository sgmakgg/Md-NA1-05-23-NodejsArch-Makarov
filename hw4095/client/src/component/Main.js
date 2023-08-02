import React, {useEffect, useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';


import './Main.css';
import Request from "./Request";
import RequestItem from "./RequestItem";

let defReq = [{name: 'default', url: 'https://www.host.com', method: 'GET', parameters: [], contentTypes:[], body:''},
    {name: 'default2', url: 'https://www.own.co', method: 'POST', parameters: [], contentTypes:[], body:''}];

const Main = () => {

    const [requests, setRequests] = useState(defReq);
    const [reqItem, setCurrentReqItem] = useState(defReq[0]);

    useEffect(()=>{

        let locRequests = localStorage.getItem('requests');

        if(locRequests !== null){
            setRequests(JSON.parse(locRequests));
        }
        else
            localStorage.setItem('requests', JSON.stringify(defReq));
    },[]);
    useEffect(() => {

    }, [reqItem]);

    const cbCurrentRequestItem = (name) =>{
        let currItem = requests.find(item => (item.name === name))
        setCurrentReqItem(currItem);
    }


    return(
        <Grid className='MainPage'  container >
            <Grid className='RequestItems' xs={3}
                  // display="flex"
                  justifyContent="left"
                  alignItems="top">

                {requests.map((item, index) => (
                    <Request key = {index} reqName = {item.name} reqMeth = {item.method} cbCurrentRequestItem = {cbCurrentRequestItem}></Request>
                ))}

            </Grid>
            <Grid  container xs={9}   rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{minHeight:'30vh'}}>
                {(reqItem!==null)&&<RequestItem reqItem = {reqItem}></RequestItem>}
                <Grid className='Response' xs={12}>
                    <h1>Response</h1>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default React.memo(Main);