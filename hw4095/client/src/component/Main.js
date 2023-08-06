import React, {useEffect, useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';


import './Main.css';
import Request from "./Request";
import RequestItem from "./RequestItem";

let defReq = [{name: 'new',
                                        url: 'http://',
                                        method: 'GET',
                                        parameters: [],
                                        contentTypes:[],
                                        body:''}];
const localStorageRequestsKey = 'requests';

const Main = () => {

    const [requests, setRequests] = useState(defReq);
    const [reqItem, setCurrentReqItem] = useState(defReq[0]);

    useEffect(()=>{

        let locRequests = localStorage.getItem(localStorageRequestsKey);

        if(locRequests !== null){
            setRequests(JSON.parse(locRequests));
        }
        else
            localStorage.setItem(localStorageRequestsKey, JSON.stringify(defReq));
    },[]);

    useEffect(() => {

    }, [reqItem]);

    const cbCurrentRequestItem = (name) =>{
        let currItem = requests.find(item => (item.name === name))
        setCurrentReqItem(currItem);
    }

    const cbSaveRequest = (reqObj) => {
        let clonedReq = [...requests];
        clonedReq.push(reqObj);
        localStorage.setItem(localStorageRequestsKey, JSON.stringify(clonedReq));
        setRequests(clonedReq);
    }

    const cbDeleteReq = (reqObj) => {
        let clonedReq = [...requests];
        for (let i = 1; i < clonedReq.length; i++) {
            if(clonedReq[i].name === reqObj.name && clonedReq[i].method === reqObj.method && clonedReq[i].url === reqObj.url){
                clonedReq.splice(i,1);
                i--;
            }
        }
        localStorage.setItem(localStorageRequestsKey, JSON.stringify(clonedReq));
        setRequests(clonedReq);
    }

    return(
        <Grid className='MainPage'  container >
            <Grid className='RequestItems' xs={3}
                  // display="flex"
                  justifyContent="left"
                  alignItems="top">

                {requests.map((item, index) => (
                    <Request key = {index}
                             reqName = {item.name}
                             reqMeth = {item.method}
                             cbCurrentRequestItem = {cbCurrentRequestItem}>
                    </Request>
                ))}

            </Grid>
            <Grid  container xs={9}   rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{minHeight:'30vh', maxHeight:'50%'}}>
                {(reqItem!==null)&&<RequestItem reqItem = {reqItem}
                                                cbSaveRequest={cbSaveRequest}
                                                cbDeleteReq={cbDeleteReq}>
                                    </RequestItem>}
            </Grid>
        </Grid>
    );
};

export default React.memo(Main);