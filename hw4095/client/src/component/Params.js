import React, {Fragment} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {Button, TextField} from "@mui/material";

const Params = ({parameters}) =>{
    return(
        <Fragment>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={8}>
                    <TextField id="outlined-search" label="Parameter key"
                               sx={{ width: '100%'}}
                               size='small'
                    />

                    <TextField id="outlined-search" label="Parameter value"
                               sx={{ width: '100%'}}
                               size='small'
                    />
            </Grid>
            <Grid display="flex"
                  justifyContent="left"
                  alignItems="left"
                  xs={2}>
                <Item sx={{ width: '100%', height:'10vh'}}>
                    <Button variant="outlined" size="medium">
                        DELETE
                    </Button>
                </Item>
            </Grid>
        </Fragment>
    )
}

export default React.memo(Params)