import React, {Fragment} from "react";
import {Autocomplete, Button, ButtonGroup, TextField} from "@mui/material";
import Item from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Unstable_Grid2";
import Params from "./Params";
import Headers from "./Headers";

const RequestItem = () => {

    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={12}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <TextField id="outlined-search" label="Name"
                               sx={{ width: '100%'}}
                               size='small'
                    />
                </Item>
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={4}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5 }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={['GET', 'POST']}

                        size='small'
                        renderInput={(params) => <TextField {...params} label="Method" />}
                    />
                </Item>
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={8}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <TextField id="outlined-search" label="URL"
                               sx={{ width: '100%'}}
                               size='small'
                    />
                </Item>
            </Grid>
            <Params></Params>
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