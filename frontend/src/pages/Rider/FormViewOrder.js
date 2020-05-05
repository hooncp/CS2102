import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';


export class FormViewOrder extends Component {
    state = {
        month: "",
        year: "",
        monthError: "",
        yearError: ""
    };

    change = e => {
        // this.props.onChange({ [e.target.name]: e.target.value });
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.loadData(this.state.month, this.state.year);
        this.setState({
            month: "",
            year: "",
            monthError: "",
            yearError: ""
        });
    };

    render() {
        return (
            <div>
                <h2>View Completed Orders</h2>
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

export default FormViewOrder
