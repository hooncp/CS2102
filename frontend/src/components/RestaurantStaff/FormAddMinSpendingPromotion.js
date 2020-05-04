import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class FormAddMinSpendingPromotion extends Component {
    state = {
        minSpendingAmt: '',
        discAmt: '',
        discUnit: '',
        description: '',
        emptyFieldError: ""
    };

    validate = () => {
        let isError = false;
        const errors = {
            emptyFieldError: ""
        };

        if (this.state.minSpendingAmt.length === 0
            || this.state.discAmt.length === 0
            || this.state.discUnit.length === 0
            || this.state.description.length === 0
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


    submit = e => {
        e.preventDefault();
        return fetch("http://localhost:5000/rs/createMinSpendingPromotion", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.props.userId,
                promoCode: this.props.promoCode,
                promoType: this.props.promoType,
                startDate: this.props.startDate,
                endDate: this.props.endDate,
                minSpendingAmt: this.state.minSpendingAmt,
                discAmt: this.state.discAmt,
                discUnit: this.state.discUnit,
                description: this.state.description
            })
        })
            .then(res => {
                console.log('Success');
                this.props.clearData();
                this.setState({
                    minSpendingAmt: '',
                    discAmt: '',
                    discUnit: '',
                    description: '',
                    emptyFieldError: ""
                })
            })
            .catch(err => err);
    };
    render() {
        return (
            <div>
                <h2>Min. Spending Promotion Details</h2>
                <TextField
                    name="minSpendingAmt"
                    placeholder="Enter Minimum Amt"
                    label="Minimum Spending Amount "
                    onChange={e => this.change(e)}
                    defaultValue={this.state.minSpendingAmt}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="discAmt"
                    placeholder="Enter Discount Amount"
                    label="Discount Amount"
                    onChange={e => this.change(e)}
                    defaultValue={this.state.discAmt}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="discUnit"
                    placeholder="Enter Discount Unit"
                    label="Discount Unit"
                    onChange={e => this.change(e)}
                    defaultValue={this.state.discUnit}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="description"
                    placeholder="Enter Description"
                    label="Description"
                    onChange={e => this.change(e)}
                    defaultValue={this.state.description}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.submit}
                >Submit</Button>
            </div>
        );
    }
}

export default FormAddMinSpendingPromotion;