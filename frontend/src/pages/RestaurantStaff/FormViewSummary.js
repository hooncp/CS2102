import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';


export class FormViewSummary extends Component {
    state = {
        month: "",
        year: "",
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

        if (this.state.month.length === 0
            || this.state.year.length) {
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
        this.props.fetchData(this.state.month, this.state.year);
        this.setState({
            month: "",
            year: "",
            emptyFieldError: ""
        });
    };

    render() {
        return (
            <div>
                <h2>View Summary Info</h2>
                <TextField
                    name="month"
                    placeholder="Enter Month"
                    label="Month"
                    onChange={e => this.change(e)}
                    value={this.state.month}
                    margin="normal"
                //fullWidth="true"
                />
                <br />
                <TextField
                    name="year"
                    placeholder="Enter Year"
                    label="Year"
                    onChange={e => this.change(e)}
                    value={this.state.year}
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

export default FormViewSummary
