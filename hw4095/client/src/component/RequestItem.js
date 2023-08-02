import React, {Fragment, useEffect, useState} from "react";
import {Autocomplete, Box, Button, ButtonGroup, TextField} from "@mui/material";
import Item from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Unstable_Grid2";
import Params from "./Params";
import Headers from "./Headers";

// let defReq = [{name: 'default', url: 'https://www.host.com', method: 'GET', parameters: [{key: 'key', value: 'value'}], contentTypes:[{key:'Accept', value:'text/html'}], body:''},
//     {name: 'default2', url: 'https://www.own.co', method: 'POST', parameters: [], contentTypes:[], body:''}];

const reqMethodOpt = ['GET', 'POST'];
const RequestItem = ({reqItem}) => {

    const [reqName, setReqName] = useState(reqItem.name);
    const [reqMethod, setReqMethod] = useState(reqItem.method || reqMethodOpt[0]);
    const [reqUrl, setReqUrl] = useState(reqItem.url);
    const [reqGetParams, setReqGetParams] = useState(reqItem.parameters);
    const [reqBody, setReqBody] = useState(reqItem.body);
    const [reqContentTypes, setReqContentTypes] = useState(reqItem.contentTypes);

    useEffect(() => {
        setReqName(reqItem.name);
        setReqMethod(reqItem.method || reqMethodOpt[0]);
        setReqUrl(reqItem.url);
        setReqGetParams(reqItem.parameters);
        setReqContentTypes(reqItem.contentTypes);
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
                    Add GET parameter
                </Button>
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
            {(reqMethod === 'POST' && reqContentTypes.length !== 0) && reqContentTypes.map((item, index)=>(<Headers contentType = {item}
                                                                                                                    cbDeleteContentType = {cbDeleteContentType}
                                                                                                                    cbUpdateContentType = {cbUpdateContentType}
                                                                                                                    key={index}
                                                                                                                    index={index}></Headers>))}
            {reqMethod === 'POST' && <Grid display="flex"
                                          justifyContent="left"
                                          alignItems="left"
                                          xs={3}>
                <Button sx={{ width: '60%', height:'30%'}} variant="outlined" size="medium" onClick={addContentType}>
                    Add Content type
                </Button>
            </Grid>}

            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={12}>
                <Item sx={{ width: '100%', height:'30%'}}>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button>Save request</Button>
                        <Button>Send request</Button>
                        <Button>Clear form</Button>
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
        </Fragment>
    );
}

export default React.memo(RequestItem);