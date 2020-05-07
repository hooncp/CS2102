import 'date-fns';
import { format } from 'date-fns';
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
import { Interval } from './Interval';



export class FormAddSchedule extends Component {
    state = {
        startDate: "2020-05-24T00:00",
        endDate: "2020-05-24T00:00",
        startDateError: "",
        endDateError: "",
        intervals: []
    };

    addInterval = () => {
        this.setState({
            intervals: [...this.state.intervals, {
                "startTime": "2020-05-24T00:00",
                "endTime": "2020-05-24T00:00"
            }
            ]
        })
    };

    handleStartIntervalChange = (e, index) => {
        this.state.intervals[index]["startTime"] = new Date(e.target.value).toLocaleString('en-US');
    }

    handleEndIntervalChange = (e, index) => {
        this.state.intervals[index]["endTime"] = new Date(e.target.value).toLocaleString('en-US');
    }

    handleStartDateChange = (e) => {
        this.setState({ startDate: new Date(e.target.value).toLocaleString('en-US') }, () => { console.log(this.state.startDate) });
    };

    handleEndDateChange = (e) => {
        this.setState({ endDate: new Date(e.target.value).toLocaleString('en-US') }, () => { console.log(this.state.endDate) });
    };

    // onSubmit = () => {
    //     this.state.intervals.forEach(element => {
    //         console.log(element);
    //     });
    // }


    validate = () => {
        let isError = false;
        const errors = {
            startDateError: "",
            endDateError: ""
        };

        if (this.state.startDate.length === 0) {
            isError = true;
            errors.foodItemError = "Error in start date";
            alert(errors.startDateError);
        }
        if (this.state.endDate.length === 0) {
            isError = true;
            errors.endDateError = "Error in end date";
            alert(errors.categoryError);
        }

        this.setState({
            ...this.state,
            ...errors
        });

        return isError;
    };

    onSubmit = e => {
        e.preventDefault();
        return fetch("http://localhost:5000/rider/createWeeklySchedule", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.props.userId,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                intervals: this.state.intervals
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res !== null) {
                    console.log(res);
                    //this.props.reloadData();
                    this.setState({
                        startDate: new Date(),
                        endDate: new Date(),
                        startDateError: "",
                        endDateError: "",
                        intervals: []
                    });
                } else {
                    alert("Error. Schedule or Intervals does not meet requirements. Check database for details");
                }
            })
            .catch(err => alert(err));

    };

    render() {
        return (
            <div>
                <h2>Add Weekly Schedule (Part-Time) </h2>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid >
                        <TextField
                            id="datetime-local"
                            label="Start Date"
                            type="datetime-local"
                            defaultValue="2020-05-24T00:00"
                            //className={classes.textField}
                            onChange={this.handleStartDateChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="datetime-local"
                            label="End Date"
                            type="datetime-local"
                            defaultValue="2020-05-24T00:00"
                            //className={classes.textField}
                            onChange={this.handleEndDateChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
                <br />
                <h2>Add Week's Intervals</h2>
                {
                    this.state.intervals.map((interval, i) => {
                        return (
                            <Interval index={i}
                                handleStartIntervalChange={this.handleStartIntervalChange}
                                handleEndIntervalChange={this.handleEndIntervalChange} />
                        );
                    })
                }
                <br />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.addInterval}
                >Add Interval</Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.onSubmit}
                >Submit</Button>
            </div>
        );
    }
}

export default FormAddSchedule
