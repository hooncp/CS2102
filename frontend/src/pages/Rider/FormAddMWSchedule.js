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



export class FormAddMWSchedule extends Component {
    state = {
        monthStartDate: "2020-05-24T00:00",
        monthEndDate: "2020-05-24T00:00",
        startDate1: "2020-05-24T00:00",
        endDate1: "2020-05-24T00:00",
        startDate2: "2020-05-24T00:00",
        endDate2: "2020-05-24T00:00",
        startDate3: "2020-05-24T00:00",
        endDate3: "2020-05-24T00:00",
        startDate4: "2020-05-24T00:00",
        endDate4: "2020-05-24T00:00",
        startDateError: "",
        endDateError: "",
        intervals1: [],
        intervals2: [],
        intervals3: [],
        intervals4: []
    };

    addInterval = () => {
        this.setState({
            intervals1: [...this.state.intervals1, {
                "startTime": "2020-05-24T00:00",
                "endTime": "2020-05-24T00:00"
            }
            ],
            intervals2: [...this.state.intervals2, {
                "startTime": "2020-05-24T00:00",
                "endTime": "2020-05-24T00:00"
            }
            ],
            intervals3: [...this.state.intervals3, {
                "startTime": "2020-05-24T00:00",
                "endTime": "2020-05-24T00:00"
            }
            ],
            intervals4: [...this.state.intervals4, {
                "startTime": "2020-05-24T00:00",
                "endTime": "2020-05-24T00:00"
            }
            ]
        })
    };

    handleStartIntervalChange = (e, index) => {
        var week1Interval = new Date(e.target.value);
        var week2Interval = new Date(e.target.value);
        var week3Interval = new Date(e.target.value);
        var week4Interval = new Date(e.target.value);

        week2Interval.setDate(week1Interval.getDate() + 7);
        week3Interval.setDate(week1Interval.getDate() + 14);
        week4Interval.setDate(week1Interval.getDate() + 21);

        this.state.intervals1[index]["startTime"] = week1Interval.toLocaleString('en-US');
        this.state.intervals2[index]["startTime"] = week2Interval.toLocaleString('en-US');
        this.state.intervals3[index]["startTime"] = week3Interval.toLocaleString('en-US');
        this.state.intervals4[index]["startTime"] = week4Interval.toLocaleString('en-US');
    }

    handleEndIntervalChange = (e, index) => {
        var week1Interval = new Date(e.target.value);
        var week2Interval = new Date(e.target.value);
        var week3Interval = new Date(e.target.value);
        var week4Interval = new Date(e.target.value);

        week2Interval.setDate(week1Interval.getDate() + 7);
        week3Interval.setDate(week1Interval.getDate() + 14);
        week4Interval.setDate(week1Interval.getDate() + 21);

        this.state.intervals1[index]["endTime"] = week1Interval.toLocaleString('en-US');
        this.state.intervals2[index]["endTime"] = week2Interval.toLocaleString('en-US');
        this.state.intervals3[index]["endTime"] = week3Interval.toLocaleString('en-US');
        this.state.intervals4[index]["endTime"] = week4Interval.toLocaleString('en-US');
    }

    handleStartDateChange = (e) => {
        var startDate1 = new Date(e.target.value);
        var startDate2 = new Date(e.target.value);
        var startDate3 = new Date(e.target.value);
        var startDate4 = new Date(e.target.value);

        startDate2.setDate(startDate1.getDate() + 7);
        startDate3.setDate(startDate1.getDate() + 14);
        startDate4.setDate(startDate1.getDate() + 21);

        this.setState({
            startDate: new Date(e.target.value).toLocaleString('en-US'),
            startDate1: startDate1.toLocaleString('en-US'),
            startDate2: startDate2.toLocaleString('en-US'),
            startDate3: startDate3.toLocaleString('en-US'),
            startDate4: startDate4.toLocaleString('en-US'),
        });


    };

    handleEndDateChange = (e) => {
        var endDate1 = new Date(e.target.value);
        var endDate2 = new Date(e.target.value);
        var endDate3 = new Date(e.target.value);
        var endDate4 = new Date(e.target.value);

        endDate3.setDate(endDate4.getDate() - 7);
        endDate2.setDate(endDate4.getDate() - 14);
        endDate1.setDate(endDate4.getDate() - 21);

        this.setState({
            endDate: new Date(e.target.value).toLocaleString('en-US'),
            endDate1: endDate1.toLocaleString('en-US'),
            endDate2: endDate2.toLocaleString('en-US'),
            endDate3: endDate3.toLocaleString('en-US'),
            endDate4: endDate4.toLocaleString('en-US'),
        });
    };

    // onSubmit = () => {
    //     console.log("start: " + this.state.startDate1 + "end " + this.state.endDate1);
    //     console.log("start: " + this.state.startDate2 + "end " + this.state.endDate2);
    //     console.log("start: " + this.state.startDate3 + "end " + this.state.endDate3);
    //     console.log("start: " + this.state.startDate4 + "end " + this.state.endDate4);

    //     this.state.intervals1.forEach(element => {
    //         console.log(element);
    //     });
    //     this.state.intervals2.forEach(element => {
    //         console.log(element);
    //     });
    //     this.state.intervals3.forEach(element => {
    //         console.log(element);
    //     });
    //     this.state.intervals4.forEach(element => {
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
        return fetch("http://localhost:5000/rider/createMonthlySchedule", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                schedules:
                    [{
                        userId: this.props.userId,
                        startDate: this.state.startDate1,
                        endDate: this.state.endDate1,
                        intervals: this.state.intervals1
                    },
                    {
                        userId: this.props.userId,
                        startDate: this.state.startDate2,
                        endDate: this.state.endDate2,
                        intervals: this.state.intervals2
                    },
                    {
                        userId: this.props.userId,
                        startDate: this.state.startDate3,
                        endDate: this.state.endDate3,
                        intervals: this.state.intervals3
                    },
                    {
                        userId: this.props.userId,
                        startDate: this.state.startDate4,
                        endDate: this.state.endDate4,
                        intervals: this.state.intervals4
                    }
                    ]

            })
        })
            .then(res => {
                console.log('Success');
                this.props.reloadData();
                this.setState({
                    monthStartDate: "2020-05-24T00:00",
                    monthEndDate: "2020-05-24T00:00",
                    startDate1: "2020-05-24T00:00",
                    endDate1: "2020-05-24T00:00",
                    startDate2: "2020-05-24T00:00",
                    endDate2: "2020-05-24T00:00",
                    startDate3: "2020-05-24T00:00",
                    endDate3: "2020-05-24T00:00",
                    startDate4: "2020-05-24T00:00",
                    endDate4: "2020-05-24T00:00",
                    startDateError: "",
                    endDateError: "",
                    intervals1: [],
                    intervals2: [],
                    intervals3: [],
                    intervals4: []
                });
            })
            .catch(err => err);

    };

    render() {
        return (
            <div>
                <h2>Add Monthly Schedule (Full-Time)</h2>
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
                    this.state.intervals1.map((interval, i) => {
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

export default FormAddMWSchedule
