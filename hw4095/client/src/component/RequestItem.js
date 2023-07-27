import React, {Fragment, useState} from "react";
import {Autocomplete, Box, Button, ButtonGroup, TextField} from "@mui/material";
import Item from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Unstable_Grid2";
import Params from "./Params";
import Headers from "./Headers";

let defReq = [{name: 'default', url: 'https://www.host.com', method: 'GET', parameters: [{key: 'key', value: 'value'}], contentTypes:{}, body:''},
    {name: 'default2', url: 'https://www.own.co', method: 'POST', parameters: [{}], contentTypes:{}, body:''}];

const reqMethodOpt = ['GET', 'POST'];
const RequestItem = ({reqItem}) => {

    const [reqName, setReqName] = useState(reqItem.name);
    const [reqMethod, setReqMethod] = useState(reqItem.method || reqMethodOpt[0]);
    const [reqUrl, setReqUrl] = useState(reqItem.url);
    const [getParams, setGetParams] = useState(reqItem.parameters);

    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={10}>
                <Box sx={{ width: '100%', marginTop: 5}}>
                    <TextField
                        value={reqName}
                        onChange={(event, newValue) => {
                            setReqName(newValue);
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
                    <Autocomplete sx={{ width: '100%', height:'10vh'}}
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
                        onChange={(event, newValue) => {
                            setReqUrl(newValue);
                        }}
                        id="outlined-search" label="URL"
                               sx={{ width: '100%'}}
                               size='small'
                    />
            </Grid>
            {(reqMethod === 'GET') && getParams.map((item, index)=>(<Params parameters = {item} key={index}></Params>))}
            <Headers></Headers>

            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={12}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
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
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <hr/>
                </Item>
            </Grid>
        </Fragment>
    );
}

export default React.memo(RequestItem);