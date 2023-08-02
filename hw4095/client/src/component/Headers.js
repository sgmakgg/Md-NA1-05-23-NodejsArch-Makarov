import React, {Fragment, useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {Autocomplete, Button, TextField} from "@mui/material";

const Headers = ({contentType, index, cbDeleteContentType, cbUpdateContentType}) =>{

    const [contentTypeKey, setContentTypeKey] = useState(contentType.key);
    const [contentTypeValue, setContentTypeValue] = useState(contentType.value);

    useEffect(() => {
        cbUpdateContentType({key: contentTypeKey, value: contentTypeValue}, index);
    }, [contentTypeKey, contentTypeValue]);

    const deleteContentType = () => {
        cbDeleteContentType(index);
    }

    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={8}>

                    <Autocomplete sx={{ width: '100%'}}
                        value={contentTypeKey}
                        onChange={(event, newValue) => {
                            setContentTypeKey(newValue);
                        }}
                        id="combo-box-demo"
                        options={['Content-type', 'Origin', 'Accept']}

                        size='small'
                        renderInput={(params) => <TextField {...params} label="Header" />}
                    />
                    <TextField value={contentTypeValue}
                               onChange={(EO) => {
                                   setContentTypeValue(EO.target.value);
                               }}
                               id="outlined-search"
                               label="Header value"
                               sx={{ width: '100%'}}
                               size='small'
                    />
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={2}>
                <Item sx={{ width: '100%', height:'30%'}}>
                    <Button variant="outlined" size="medium" onClick={deleteContentType}>
                        DELETE
                    </Button>
                </Item>
            </Grid>
        </Fragment>
    )
}

export default React.memo(Headers);