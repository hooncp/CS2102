import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class FormMinSpendingPromoDetails extends Component {
    state = {
        minSpendingAmt: '',
        discAmt: '',
        discUnit: '',
        description: '',
        showAlert: false
    };

    submit = e => {
        e.preventDefault();
        return fetch("http://localhost:5000/rs/createMinSpendingPromotion", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 86, //hardcode
                promoCode: this.props.values.promoCode,
                promoType: this.props.values.promoType,
                startDate: this.props.values.startDate,
                endDate: this.props.values.endDate,
                minSpendingAmt: this.state.minSpendingAmt,
                discAmt: this.state.discAmt,
                discUnit: this.state.discUnit,
                description: this.state.description
            })
        })
            .then(res => {
                console.log('Success');
                this.props.nextStep();
            })
            .catch(err => err);
    };

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    };

    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
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
                        <h1>Enter Minimum Spending Promotion Details</h1>
                        <TextField
                            placeholder="Enter Minimum Spending Amt"
                            label="Minimum Spending Amount "
                            onChange={this.handleChange('minSpendingAmt')}
                            defaultValue={this.state.minSpendingAmt}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter discount amount"
                            label="Discount Amount"
                            onChange={this.handleChange('discAmt')}
                            defaultValue={this.state.discAmt}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter discount unit"
                            label="Discount Unit"
                            onChange={this.handleChange('discUnit')}
                            defaultValue={this.state.discUnit}
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <TextField
                            placeholder="Enter description"
                            label="Description"
                            onChange={this.handleChange('description')}
                            defaultValue={this.state.description}
                            margin="normal"
                            fullWidth="true"
                        />

                        <br />

                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={this.back}
                        >Back</Button>

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

export default FormMinSpendingPromoDetails;