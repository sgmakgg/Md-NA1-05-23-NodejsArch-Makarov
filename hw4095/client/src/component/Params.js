import React, {Fragment, useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {Button, TextField} from "@mui/material";

const Params = ({parameters, cbDeleteParameter, cbUpdateParameter, index}) =>{

    const [getParamKey, setGetParamKey] = useState(parameters.key);
    const [getParamValue, setGetParamValue] = useState(parameters.value);

    useEffect(() => {
        cbUpdateParameter({key: getParamKey, value: getParamValue}, index);
    }, [getParamKey, getParamValue]);

    const deleteParameter = () => {
        cbDeleteParameter(index);
    }

    const setKey = (EO) =>{
        setGetParamKey(EO.target.value);
    }

    const setValue = (EO) =>{
        setGetParamValue(EO.target.value);
    }

    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={8}>
                    <TextField value={getParamKey}
                               onChange={setKey}
                               id="outlined-search" label="Parameter key"
                               sx={{ width: '100%'}}
                               size='small'
                    />

                    <TextField value={getParamValue}
                               onChange={setValue}
                               id="outlined-search" label="Parameter value"
                               sx={{ width: '100%'}}
                               size='small'
                    />
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={2}>
                <Item sx={{ width: '100%', height:'30%'}}>
                    <Button variant="outlined" size="medium" onClick={deleteParameter}>
                        DELETE
                    </Button>
                </Item>
            </Grid>
        </Fragment>
    )
}

export default React.memo(Params)