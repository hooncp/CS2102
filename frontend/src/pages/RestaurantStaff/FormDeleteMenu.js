import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export class FormDeleteMenu extends Component {
    state = {
        foodItem: "",
        foodItemError: "",
    };

    change = e => {
        // this.props.onChange({ [e.target.name]: e.target.value });
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    validate = () => {
        let isError = false;
        const errors = {
            foodItemError: "",
        };

        if (this.state.foodItem.length === 0) {
            isError = true;
            errors.foodItemError = "Error in food";
            alert(errors.foodItemError);
        }

        this.setState({
            ...this.state,
            ...errors
        });

        return isError;
    };

    onSubmit = e => {
        e.preventDefault();
        return fetch("http://localhost:5000/rs/deleteSells", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.props.userId,
                fname: this.state.foodItem,
            })
        })
            .then(res => {
                console.log('Success');
                this.props.reloadData();
                this.setState({
                    foodItem: "",
                    foodItemError: ""
                });
            })
            .catch(err => err);
    };

    render() {
        return (
            <div>
                <h2>Delete Food Item from Menu</h2>
                <TextField
                    name="foodItem"
                    placeholder="Enter Food Item"
                    label="Food Item"
                    onChange={e => this.change(e)}
                    value={this.state.foodItem}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <br />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={this.onSubmit}
                >Submit</Button>
            </div>
        );
    }
}
export default FormDeleteMenu