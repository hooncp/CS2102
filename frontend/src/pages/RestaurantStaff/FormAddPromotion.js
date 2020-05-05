import 'date-fns';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormAddMinSpendingPromotion } from './FormAddMinSpendingPromotion';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


export class FormAddPromotion extends Component {

    state = {
        promoCode: "",
        promoType: "",
        startDate: "2020-05-24T00:00",
        endDate: "2020-05-24T00:00",
        emptyFieldError: ""
    };

    validate = () => {
        let isError = false;
        const errors = {
            emptyFieldError: ""
        };

        if (this.state.promoCode.length === 0
            || this.state.promoType.length === 0
            || this.state.startDate.length === 0
            || this.state.endDate.length === 0
        ) {
            isError = true;
            errors.emptyFieldError = "Fields can't be empty";
            alert(errors.emptyFieldError);
        }

        this.setState({
            ...this.state,
            ...errors
        });

        return isError;
    };


    change = e => {
        // this.props.onChange({ [e.target.name]: e.target.value });
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleStartDateChange = (e) => {
        this.setState({ startDate: new Date(e.target.value).toLocaleString('en-US') }, () => { console.log(this.state.startDate) });
    };

    handleEndDateChange = (e) => {
        this.setState({ endDate: new Date(e.target.value).toLocaleString('en-US') }, () => { console.log(this.state.endDate) });
    };

    clearData = () => {
        this.setState({
            promoCode: "",
            promoType: "",
            startDate: "2020-05-24T00:00",
            endDate: "2020-05-24T00:00",
            emptyFieldError: ""
        })
    }


    renderDiv = () => {
        switch (this.state.promoType) {
            case "minspending": return <div><FormAddMinSpendingPromotion
                userId={this.props.userId}
                promoCode={this.state.promoCode}
                promoType={this.state.promoType}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                clearData={this.clearData} /></div>
            // case 2: return <div style={{ "height": "1000px" }}><Menu handleClose={this.handleClose} />   </div>
            // case 3: return <div style={{ "height": "1000px" }}><Summary handleClose={this.handleClose} /></div>
        }
        return null;
    }

    render() {
        return (
            <div>
                <h2>Add Promotion</h2>
                <TextField
                    name="promoCode"
                    placeholder="Enter Promotion Code"
                    label="Promotion Code"
                    onChange={e => this.change(e)}
                    value={this.state.promoCode}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="promoType"
                    placeholder="Enter Promotion Type"
                    label="Promotion Type"
                    onChange={e => this.change(e)}
                    value={this.state.promoType}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <br />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <TextField
                        id="datetime-local"
                        label="Start Date"
                        type="datetime-local"
                        defaultValue="2020-05-24T00:00"
                        //className={classes.textField}
                        onChange={this.handleStartDateChange}
                        fullWidth="true"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="datetime-local"
                        label="End Date"
                        type="datetime-local"
                        defaultValue="2020-05-24T00:00"
                        //className={classes.textField}
                        onChange={this.handleEndDateChange}
                        fullWidth="true"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br />
                {/* <Button
                            color="primary"
                            variant="contained"
                            onClick={this.continue}
                        >Continue</Button> */}
                {this.renderDiv()}
            </div>
        );
    }
}

export default FormAddPromotion;