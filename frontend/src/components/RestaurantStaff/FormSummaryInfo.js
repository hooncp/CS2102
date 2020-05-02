import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export class FormSummaryInfo extends Component {

    submit = e => {
        e.preventDefault();
        console.log("Submit");
        console.log(this.props.values.month);
        if (this.props.values.month === '' || this.props.values.year === '') {
            console.log("empty");
            alert("please ensure that field is not empty!");
            return;
        } else {
            this.props.nextStep();
            //TODO clear form
        }

    };

    render() {
        return (
            <MuiThemeProvider >
                <React.Fragment>
                    <Dialog
                        open={true}
                        fullWidth="true"
                        maxWidth='sm'
                    >
                        <h1>Enter Month</h1>
                        <TextField
                            placeholder="Enter Month"
                            label="Month"
                            onChange={this.props.handleChange('month')}
                            defaultValue={this.props.values.month}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter Year"
                            label="Year"
                            onChange={this.props.handleChange('year')}
                            defaultValue={this.props.values.year}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.submit}
                        >Submit</Button>
                    </Dialog>
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

export default FormSummaryInfo