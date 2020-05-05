import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';


export class afterSubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            rname: this.props.location.state.rname,
            orderedFood: this.props.location.state.orderedFood,
            orderId: this.props.location.state.orderId,
            foodToQty: this.props.location.state.foodToQty,
            foodToReview: {},
            orderInfo: [],
            deliveryInfo: [],
            rating: null,

        }
    }

    componentDidMount() {
        let temp = {};
        this.state.orderedFood.forEach(item => {
            temp = Object.assign({[item.fname]: ""}, temp);
        })
        this.setState({foodToReview: temp});
        this.getOrderInfo();
        this.getDeliveryInfo();
    }

    getDeliveryInfo = () => {
        fetch(`http://localhost:5000/customer/getDeliveryRider?orderId=${this.state.orderId}`,
            {
                method: 'GET',
                headers: {
                    'Accept':
                        'application/json',
                    'Content-Type':
                        'application/json',
                }
            }
        ).then(res => res.json())
            .then(json => {
                this.setState({deliveryInfo: json[0]})
                console.log('deliveryInfo', this.state.deliveryInfo)
        })
        .catch(err => err);


    }

    getOrderInfo = () => {
        fetch(`http://localhost:5000/customer/getOrderInfo?orderId=${this.state.orderId}`,
            {
                method: 'GET',
                headers: {
                    'Accept':
                        'application/json',
                    'Content-Type':
                        'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(json => {
                this.setState({orderInfo: json[0]})
                console.log('orderinfo', this.state.orderInfo)
            })
            .catch(err => err);
    }



    handleInputReview = (event) => {
        const {name, value} = event.target;
        let temp = this.state.foodToReview;
        temp[name] = value;
        this.setState({foodToReview: temp});
    }
    handleSubmitReview = () => {
        const arrLen = Object.keys(this.state.foodToReview).length;
        const arr = new Array(arrLen);
        const foodToReviewCopy = this.state.foodToReview;
        let i = 0;
        for (var key in foodToReviewCopy) {
            arr[i] = {
                "orderId": this.state.orderId,
                "fname": key,
                "rname": this.state.rname,
                "reviewContent": foodToReviewCopy[key]
            }
            i++;
        }
        fetch(`http://localhost:5000/customer/submitReview`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reviews: arr,
            })
        })
            .then(res => res.json())
            .catch(err => err);
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }

    render() {
        const orderInfo = this.state.orderInfo;
        const datetime = orderInfo.timeoforder + "";
        const date = datetime.substr(0, 10);
        const time = datetime.substr(11, 8);

                
        const deliveryInfo = this.state.deliveryInfo;
        const datetime1 = deliveryInfo.deliverytimetocustomer + "";
        const date1 = datetime1.substr(0, 10);
        const time1 = datetime1.substr(11, 8);

        console.log('orderid:', this.state.orderId);
        console.log("foodtoreview", this.state.foodToReview);
        return (
            <React.Fragment>
                <AppBar style={{backgroundColor: "#ff3d00"}} position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Review Your Order From: {this.state.rname}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <br/><br/>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item alignItems="center">
                        <Paper>
                            <span style={{fontWeight: "bold", textAlign: 'center'}}>Order Review:</span> <br/> <br/>
                            Total Food Price: ${orderInfo.totalfoodprice} | Delivery Fee: ${orderInfo.deliveryfee}
                            <br/>
                            <hr/>
                            Used Reward Points: {orderInfo.usedrewardpoints} | Earned Reward
                            Points: {orderInfo.earnedrewardpts}
                            <br/>
                            <hr/>
                            Delivery Location: {orderInfo.deliverylocation}
                            <br/>
                            <hr/>
                            Time Of Order: {date} | {time}
                            <br/> <br/>

                        </Paper>
                    </Grid>
                </Grid>
                <br/>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item alignItems="center">
                        <Paper>
                            <span style={{fontWeight: "bold", textAlign: 'center'}}>Delivery Info:</span> <br/> <br/>
                            Your order is delivered by: {deliveryInfo.userid} 
                            <hr/>
                            Received at: {date1} | {time1}
                            <br/>
                            <br/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item style={{width: "100%"}}>
                    <h2>
                        Leave a review:
                    </h2>
                </Grid>
                {this.state.orderedFood.map(res => {
                    return (
                        <div>
                            {res.fname}:
                            <br/> <br/>
                            <FormControl variant="outlined" style={{width: "100%"}}>
                                <TextField
                                    name={res.fname}
                                    label="Enter Review"
                                    placeholder="Review"
                                    variant="outlined"
                                    value={(this.state.foodToReview)[res.fname]}
                                    onChange={this.handleInputReview}
                                />
                            </FormControl>
                        </div>
                    )
                })}
                <br/>
                <Button variant="outlined" color="secondary" onClick={this.handleSubmitReview}
                        size="small">
                    Submit Review
                </Button>
                <br/> <br/> <br/>
                <FormControl variant="outlined" style={{width: "20%"}}>
                    <InputLabel>Rate Delivery</InputLabel>
                    <Select
                        required
                        name="rating"
                        value={this.state.rating}
                        onChange={this.handleChange}

                    >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>

                    </Select>
                </FormControl>
            </React.Fragment>
        )
    }
}
