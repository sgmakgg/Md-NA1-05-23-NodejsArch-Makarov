import React, {Fragment, useEffect, useState} from "react";
import {Autocomplete, Box, Button, ButtonGroup, TextField} from "@mui/material";
import Item from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Unstable_Grid2";
import Params from "./Params";
import Headers from "./Headers";
import Response from "./Response";

const reqMethodOpt = ['GET', 'POST'];

// There is also a built-in environment variable called NODE_ENV. You can read it from process.env.NODE_ENV.
//     When you run npm start, it is always equal to 'development',
//     when you run npm test it is always equal to 'test', and when you run npm run build to make a production bundle,
//     it is always equal to 'production'.
//     You cannot override NODE_ENV manually. This prevents developers from accidentally deploying a slow development build to production.
const host = process.env.NODE_ENV === 'production' ? 'http://msnodearch.elmiservis.by:4095/postman' : 'http://localhost:4095/postman';
const fetchConfig={
    URL: host,
    method: 'post',
    headers: {
        "Accept": "application/json",
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Content-Type' : 'application/json'
    },
};
const RequestItem = ({reqItem, cbSaveRequest, cbDeleteReq}) => {

    const [reqName, setReqName] = useState(reqItem.name);
    const [reqMethod, setReqMethod] = useState(reqItem.method || reqMethodOpt[0]);
    const [reqUrl, setReqUrl] = useState(reqItem.url);
    const [reqGetParams, setReqGetParams] = useState(reqItem.parameters);
    const [reqBody, setReqBody] = useState(reqItem.body);
    const [reqContentTypes, setReqContentTypes] = useState(reqItem.contentTypes);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        setReqName(reqItem.name);
        setReqMethod(reqItem.method || reqMethodOpt[0]);
        setReqUrl(reqItem.url);
        setReqGetParams(reqItem.parameters);
        setReqContentTypes(reqItem.contentTypes);
        setResponseData(null);
        setReqBody(reqItem.body);
    }, [reqItem]);

    const addParameter = () => {
        let params = [...reqGetParams];
        params.push({key:'key',  value:'value'});
        setReqGetParams(params);
    }

    const cbDeleteParameter = (index) => {
        let params = [...reqGetParams];
        params.splice(index, 1);
        setReqGetParams(params);
    }

    const cbUpdateParameter = (paramObj, index) => {
        let params = [...reqGetParams];
        params[index] = paramObj;
        setReqGetParams(params);
    }

    const addContentType = () => {
        let ct = [...reqContentTypes];
        ct.push({key:'Content-type',  value:'value'});
        setReqContentTypes(ct);
    }

    const cbDeleteContentType = (index) => {
        let ct = [...reqContentTypes];
        ct.splice(index, 1);
        setReqContentTypes(ct);
    }

    const cbUpdateContentType = (ContentTypesObj, index) => {
        let ct = [...reqContentTypes];
        ct[index] = ContentTypesObj;
        setReqContentTypes(ct);
    }

    const reqObjFactory = () => {
        return {name: reqName,
            url: reqUrl,
            method: reqMethod,
            parameters: reqGetParams,
            contentTypes:reqContentTypes,
            body:reqBody};
    }

    const saveRequest = () =>{
        let reqObj = reqObjFactory();
        cbSaveRequest(reqObj);
    }

    const deleteReq = () => {
        let reqObj = reqObjFactory();
        cbDeleteReq(reqObj);
    }

    const sendReq = async () => {
        fetchConfig.body = JSON.stringify(reqObjFactory());
            try {
                let response=await fetch(fetchConfig.URL, fetchConfig);
                if (!response.ok) {
                    throw new Error("fetch error " + response.status);
                }
                let data=await response.json();
                setResponseData(data);
            }
            catch ( error )  {
                console.log(error.message);
            }
    }



    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={10}>
                <Box sx={{ width: '100%', marginTop: 5}}>
                    <TextField
                        value={reqName}
                        onChange={(EO) => {
                            setReqName(EO.target.value);
                        }}
                        id="outlined-helperText"
                        label="Request Name"
                        sx={{ width: '100%'}}
                        size='small'
                    />
                </Box>
            </Grid>

            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={10}>
                    <Autocomplete sx={{ width: '100%', height:'30%'}}
                        value={reqMethod}
                        onChange={(event, newValue) => {
                            setReqMethod(newValue);
                        }}
                        id="combo-box-demo"
                        options={reqMethodOpt}
                        size='small'
                        renderInput={(params) => <TextField {...params} label="Method" />}
                    />
                    <TextField
                        value={reqUrl}
                        onChange={(EO) => {
                            setReqUrl(EO.target.value);
                        }}
                        id="outlined-search" label="URL"
                               sx={{ width: '100%'}}
                               size='small'
                    />
            </Grid>
            {(reqMethod === 'GET' && reqGetParams.length !== 0) && reqGetParams.map((item, index)=>(<Params parameters = {item}
                                                                                                            cbDeleteParameter = {cbDeleteParameter}
                                                                                                            cbUpdateParameter = {cbUpdateParameter}
                                                                                                            key={index}
                                                                                                            index={index}></Params>))}
            {reqMethod === 'GET' && <Grid display="flex"
                                          justifyContent="left"
                                          alignItems="left"
                                          xs={3}>
                <Button sx={{ width: '60%', height:'30%'}} variant="outlined" size="medium" onClick={addParameter}>
                    Add parameter
                </Button>
            </Grid>}
            {reqMethod === 'GET' &&<Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={9}>
            </Grid>}

            {reqMethod === 'POST' && <Grid display="flex"
                                                justifyContent="left"
                                                alignItems="left"
                                                xs={10}>
                    <TextField sx={{ width: '100%'}}
                        value={reqBody}
                        onChange={(EO) => {
                            setReqBody(EO.target.value);
                        }}
                        id="outlined-helperText"
                        label="Body"
                        size='small'
                    />
            </Grid>}
            {reqContentTypes.length !== 0 && reqContentTypes.map((item, index)=>(<Headers contentType = {item}
                                                                                            cbDeleteContentType = {cbDeleteContentType}
                                                                                            cbUpdateContentType = {cbUpdateContentType}
                                                                                            key={index}
                                                                                            index={index}></Headers>))}
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={3}>
                <Button sx={{ width: '60%', height:'30%'}} variant="outlined" size="medium" onClick={addContentType}>
                    Add header
                </Button>
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={9}>
            </Grid>

            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={12}>
                <Item sx={{ width: '100%', height:'30%'}}>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button onClick={saveRequest}>Save request</Button>
                        <Button onClick={sendReq}>Send request</Button>
                        <Button onClick={deleteReq}>Delete request</Button>
                    </ButtonGroup>
                </Item>
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={12}>
                <Item sx={{ width: '100%', height:'1%'}}>
                    <hr/>
                </Item>
            </Grid>
            {responseData !== null && <Response responseData = {responseData}></Response>}
        </Fragment>
    );
}

export default React.memo(RequestItem);