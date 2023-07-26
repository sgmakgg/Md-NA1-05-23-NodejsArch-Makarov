import React, {Fragment} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {Autocomplete, Button, TextField} from "@mui/material";

const Headers = () =>{
    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={4}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={['Content-type', 'Origin', 'Accept']}

                        size='small'
                        renderInput={(params) => <TextField {...params} label="Header" />}
                    />
                </Item>
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={4}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <TextField id="outlined-search" label="Header value"
                               sx={{ width: '100%'}}
                               size='small'
                    />
                </Item>

            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={4}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <Button variant="outlined" size="medium">
                        DELETE
                    </Button>
                </Item>
            </Grid>
        </Fragment>
    )
}

export default React.memo(Headers);