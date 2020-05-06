import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/date-fns';

export class ViewScheduleTable extends Component {

    render() {
        if (!this.props.showTable) {
            return <div></div>
        }
        if (this.props.loading) {
            return (
                <div>Loading...</div>
            );
        } else {
            const { data, header } = this.props;
            return (
                <TableContainer component={Paper}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                {header.map((x) =>
                                    <TableCell>
                                        {x.name}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row["starttime"]}>
                                    <TableCell component="th" scope="row">
                                        {new Date(row["starttime"]).toLocaleString('en-US')}
                                    </TableCell>
                                    <TableCell>{new Date(row["endtime"]).toLocaleString('en-US')}</TableCell>
                                    <TableCell>{row["intervalduration"]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }
    }
}

export default ViewScheduleTable