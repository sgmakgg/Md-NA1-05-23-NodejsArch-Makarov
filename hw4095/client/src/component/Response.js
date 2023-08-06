import React, {Fragment, useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "@mui/material/Unstable_Grid2";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Paper from '@mui/material/Paper';

const Response = ({responseData}) =>{

    const [response, setResponseData] = useState(responseData);

    useEffect(() => {
        setResponseData(responseData);
    }, [responseData]);

    return(
        <Fragment>
            <Grid container
                  justifyContent="center"
                  alignItems="center"
                  xs={12}>

                <Grid display="flex"
                    justifyContent="left"
                    alignItems="left"
                    xs={11}>
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>status</TableCell>
                                    <TableCell align="left">{response.status}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {response.headers.map(item => (
                                    <TableRow
                                        key={item.key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {item.key}
                                        </TableCell>
                                        <TableCell align="left">{item.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Item>{'\xa0'}</Item>
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>body</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {response.body !== null && <TableCell align="left">{JSON.stringify(response.body)}</TableCell>}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default React.memo(Response);