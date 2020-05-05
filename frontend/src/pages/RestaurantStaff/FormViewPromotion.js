import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';


export class FormViewPromotion extends Component {
    state = {
        promoCode: "",
        emptyFieldError: ""
    };

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    validate = () => {
        let isError = false;
        const errors = {
            emptyFieldError: ""
        };

        if (this.state.promoCode.length === 0) {
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

    onSubmit = e => {
        e.preventDefault();
        this.props.fetchData(this.state.promoCode);
        this.setState({
            promoCode: "",
            emptyFieldError: ""
        });
    };

    render() {
        return (
            <div>
                <h2>View Promotion Info</h2>
                <TextField
                    name="promoCode"
                    placeholder="Enter Promotion Code"
                    label="Promotion Code"
                    onChange={e => this.change(e)}
                    value={this.state.month}
                    margin="normal"
                //fullWidth="true"
                />
                <br />
                <br />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.onSubmit}
                >Submit</Button>

            </div >
        )
    }
}

export default FormViewPromotion
