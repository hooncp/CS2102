import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export class FormAddMenu extends Component {
    state = {
        foodItem: "",
        category: "",
        price: "",
        availability: "",
        foodItemError: "",
        categoryError: "",
        priceError: "",
        availabilityError: ""
    };

    change = e => {
        // this.props.onChange({ [e.target.name]: e.target.value });
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    //TODO VALIDATE
    validate = () => {
        let isError = false;
        const errors = {
            foodItemError: "",
            priceError: "",
            availabilityError: "",
            categoryError: ""
        };

        if (this.state.foodItem.length === 0) {
            isError = true;
            errors.foodItemError = "Error in food";
            alert(errors.foodItemError);
        }
        if (this.state.category.length === 0) {
            isError = true;
            errors.foodItemError = "Error in category";
            alert(errors.categoryError);
        }

        if (this.state.price.length === 0 || this.state.price <= 0) {
            isError = true;
            errors.priceError = "Error in pricing";
            alert(errors.priceError);
        }

        if (this.state.availability.length === 0 || this.state.availability <= 0) {
            isError = true;
            errors.availabilityError = "Error in availability";
            alert(errors.availabilityError);

        }

        this.setState({
            ...this.state,
            ...errors
        });

        return isError;
    };


    onSubmit = e => {
        e.preventDefault();
        return fetch("http://localhost:5000/rs/insertSells", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.props.userId,
                fname: this.state.foodItem,
                category: this.state.category,
                price: this.state.price,
                availability: this.state.availability
            })
        })
            .then(res => {
                console.log('Success');
                this.props.reloadData();
                this.setState({
                    foodItem: "",
                    category: "",
                    price: "",
                    availability: "",
                    foodItemError: "",
                    priceError: "",
                    availabilityError: ""
                });
            })
            .catch(err => err);
    };

    render() {
        return (
            <div>
                <h2>Add Food Item to Menu</h2>
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
                <TextField
                    name="category"
                    placeholder="Enter Food Category"
                    label="Food Category"
                    onChange={e => this.change(e)}
                    value={this.state.category}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="price"
                    placeholder="Enter Food Price"
                    label="Food Price"
                    onChange={e => this.change(e)}
                    value={this.state.price}
                    margin="normal"
                    fullWidth="true"
                />
                <br />
                <TextField
                    name="availability"
                    placeholder="Enter Food Availability"
                    label="Food Availability"
                    onChange={e => this.change(e)}
                    value={this.state.availability}
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
export default FormAddMenu