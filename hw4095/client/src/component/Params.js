import React, {Fragment} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {Button, TextField} from "@mui/material";

const Params = () =>{
    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={4}>
                <Item sx={{ width: '100%', height:'10vh', padding: 5}}>
                    <TextField id="outlined-search" label="Parameter key"
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
                    <TextField id="outlined-search" label="Parameter value"
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

export default React.memo(Params)