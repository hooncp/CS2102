import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


export class Interval extends Component {

    state = {
        startInterval: new Date(),
        endInterval: new Date(),
        startIntervalError: "",
        endIntervalError: "",
        intervals: []
    };

    handleStartIntervalChange = (e) => {
        this.props.handleStartIntervalChange(e, this.props.index);
        //this.setState({ startDate: e.target.value }, () => { console.log(this.state.startDate) });
    };

    handleEndIntervalChange = (e) => {
        this.props.handleEndIntervalChange(e, this.props.index);
        //this.setState({ endDate: e.target.value }, () => { console.log(this.state.startDate) });
    };

    render() {
        return (
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid >
                        <TextField
                            id="datetime-local"
                            label="Start Interval"
                            type="datetime-local"
                            defaultValue="2020-05-24T00:00"
                            //className={classes.textField}
                            onChange={this.handleStartIntervalChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="datetime-local"
                            label="End Interval"
                            type="datetime-local"
                            defaultValue="2020-05-24T00:00"
                            //className={classes.textField}
                            onChange={this.handleEndIntervalChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
        )
    }
}

export default Interval
