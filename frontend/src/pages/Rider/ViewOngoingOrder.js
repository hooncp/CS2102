import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';


export class ViewOngoingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departTimeForRestaurantOpen: true,
            departTimeFromRestaurantOpen: false,
            arrivalTimeAtRestaurantOpen : false,
            deliveryTimetoCustomer : false,
            finishedDelivery: false,
            orderId : props.orderId,
        }
    }

    componentDidMount() {
        // this.setState({orderId: props.orderId})
    }

    handleDepartTimeForRestaurantButton = () => {
        fetch(`http://localhost:5000/rider/updateDepartTimeForRestaurant`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: this.props.orderId,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({departTimeForRestaurantOpen: false, departTimeFromRestaurantOpen: true})
            })
            .catch(err => err);
    }
    handleDepartTimeFromRestaurantButton = () => {
        fetch(`http://localhost:5000/rider/updateDepartTimeFromRestaurant`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: this.props.orderId,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({departTimeFromRestaurantOpen: false, arrivalTimeAtRestaurantOpen: true})
            })
            .catch(err => err);
    }
    handleArrivalTimeAtRestaurantButton = () => {
        fetch(`http://localhost:5000/rider/updateArrivalTimeAtRestaurant`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: this.props.orderId,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({arrivalTimeAtRestaurantOpen: false, deliveryTimetoCustomer: true})
            })
            .catch(err => err);
    }
    handleDeliveryTimetoCustomerButton = () => {
        fetch(`http://localhost:5000/rider/updateDeliveryTimetoCustomer`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: this.props.orderId,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({deliveryTimetoCustomer: false, finishedDelivery: true})
            })
            .catch(err => err);
    }
    handleDeliveryFinish = () => {
        alert('Delivery Completed!');
        // this.props.orderId = null;
        // this.setState({orderId: null});
    }
    render() {
        console.log(this.props.orderId);
        console.log(this.state.orderId);
        const departTimeForRestaurantButton =
            <Button variant="contained" color="primary" onClick={this.handleDepartTimeForRestaurantButton} size="small">
                Departed For Restaurant
            </Button>
        const departTimeForRestaurantButtonDisabled =
            <Button variant="contained" color="primary" onClick={this.handleDepartTimeForRestaurantButton} size="small" disabled>
                Departed For Restaurant
            </Button>
        const departTimeFromRestaurant =
            <Button variant="contained" color="secondary" onClick={this.handleDepartTimeFromRestaurantButton} size="small" >
            Departed From Restaurant
        </Button>
        const departTimeFromRestaurantDisabled =
            <Button variant="contained" color="secondary" onClick={this.handleDepartTimeFromRestaurantButton} size="small" disabled>
                Departed From Restaurant
            </Button>
        const arrivalTimeAtRestaurant =
            <Button variant="contained" color="primary" onClick={this.handleArrivalTimeAtRestaurantButton} size="small" >
                Arrived At Restaurant
            </Button>
        const arrivalTimeAtRestaurantDisabled =
            <Button variant="contained" color="primary" onClick={this.handleArrivalTimeAtRestaurantButton} size="small" disabled>
                Arrived At Restaurant
            </Button>
        const deliveryTimetoCustomer =
            <Button variant="contained" color="secondary" onClick={this.handleDeliveryTimetoCustomerButton} size="small">
                Delivered To Customer
            </Button>
        const deliveryTimetoCustomerDisabled =
            <Button variant="contained" color="secondary" onClick={this.handleDeliveryTimetoCustomerButton} size="small" disabled>
                Delivered To Customer
            </Button>
        if (this.props.orderId !== null) {
            return (
                <div>
                    <h2>Currently Assigned Orders: </h2>
                    <span style={{fontWeight:"bold"}}>Order ID: {this.props.orderId} </span><br/> <br/>
                    <span style={{fontWeight:"bold"}}>Food Items: </span>
                    {this.props.orderedFood.map(res => {
                        return (
                            <div>
                                {res.fname} x {res.foodqty}
                            </div>
                        )
                    })} <br/>
                    <span style={{fontWeight:"bold"}}>Order Details: </span>
                    {this.props.orderDetails.map(res => {
                        return (
                            <div>
                                Customer ID: {res.userid} <br/>
                                Restaurant Name: {res.rname} <br/>
                                Deliver To: {res.deliverylocation} <br/>
                                Earned Delivery Fee: {res.deliveryfee} <br/>
                            </div>
                        )
                    })}
                    {this.state.departTimeForRestaurantOpen ? departTimeForRestaurantButton : departTimeForRestaurantButtonDisabled}
                    {this.state.departTimeFromRestaurantOpen ? departTimeFromRestaurant : departTimeFromRestaurantDisabled}
                    {this.state.arrivalTimeAtRestaurantOpen ? arrivalTimeAtRestaurant : arrivalTimeAtRestaurantDisabled }
                    {this.state.deliveryTimetoCustomer ? deliveryTimetoCustomer : deliveryTimetoCustomerDisabled}
                    {this.state.finishedDelivery && this.handleDeliveryFinish()}
                </div>
            )
        } else {
            return <div> <br/> No Assigned Orders...</div>
        }
    }
}

export default ViewOngoingOrder