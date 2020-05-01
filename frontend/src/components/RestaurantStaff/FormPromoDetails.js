import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class FormPromoDetails extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    };


    render() {
        const { values, handleChange } = this.props;
        return (
            <MuiThemeProvider >
                <React.Fragment>
                    <Dialog
                        open="true"
                        fullWidth="true"
                        maxWidth='sm'
                    >
                        <h1>Enter Promotion Details</h1>
                        <TextField
                            placeholder="Enter Promotion Code"
                            label="Promotion Code"
                            onChange={handleChange('promoCode')}
                            defaultValue={values.promoCode}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter Promotion Type"
                            label="Promotion Type"
                            onChange={handleChange('promoType')}
                            defaultValue={values.promoType}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter Start Date"
                            label="Start Date"
                            onChange={handleChange('startDate')}
                            defaultValue={values.startDate}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter End Date"
                            label="End Date"
                            onChange={handleChange('endDate')}
                            defaultValue={values.endDate}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.continue}
                        >Continue</Button>
                    </Dialog>
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

export default FormPromoDetails;