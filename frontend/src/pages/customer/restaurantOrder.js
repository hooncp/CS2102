import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';


export class restaurantOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            orderDetails: this.props.location.state.orderDetails,
            area: this.props.location.state.area,
            chosenLocation: this.props.location.state.chosenLocation,
            rname: this.props.location.state.rname,
            foodToQty: {},
            allFoodAndRes: this.props.location.state.allFoodAndRes,
            modeOfPayment: "cash",
            creditCardInfo: "",
            promoCode: [],
            selectedPromoCode: null,
            availableRewardPts: "",
            usedRewardPts: 0,
            orderId: "",
            orderedFood: [],
            minOrderAmt: "",
        }
    }

    componentDidMount() {
        const filteredArr = this.state.allFoodAndRes.filter(res => {
            return res.rname === this.state.rname
        });
        let temp = {};
        filteredArr.forEach(item => {
            const tempfname = item.fname;
            temp = Object.assign({[tempfname]: 0}, temp);
        })
        this.setState({foodToQty: temp});
        this.getCreditCardInfo();
        this.getPromoCode();
        this.getAvailableRewardPts();
        this.getRestaurantMinOrderAmt();
    }

    getRestaurantMinOrderAmt = () => {
        fetch(`http://localhost:5000/customer/getRestaurantMinOrderAmt?rname=${this.state.rname}`,
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
                console.log('minOrderAmt', json);
                this.setState({minOrderAmt: json})
                console.log('minOrderAmt', this.state.minOrderAmt);
            })
            .catch(err => err);
    }

    getAvailableRewardPts = () => {
        fetch(`http://localhost:5000/customer/customerRewardPoints?userId=${this.state.userId}`,
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
                this.setState({availableRewardPts: json[0].availablerewardpts})
                console.log('availableRewardPts', this.state.availableRewardPts)
            })
            .catch(err => err);
    }
    getPromoCode = () => {
        fetch(`http://localhost:5000/general/getPromoCode?rname=${this.state.rname}`,
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
                this.setState({promoCode: json})
                console.log('promocode', this.state.promoCode)
            })
            .catch(err => err);
    }
    getCreditCardInfo = () => {
        fetch(`http://localhost:5000/customer/getCreditCardInfo?userId=${this.state.userId}`,
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
                this.setState({creditCardInfo: json[0].creditcardinfo})
                console.log('cc info', this.state.creditCardInfo)
            })
            .catch(err => err);
    }
    handleInputQty = (event) => {
        const {name, value} = event.target;
        let temp = this.state.foodToQty;
        temp[name] = value;
        this.setState({foodToQty: temp});
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }
    handleRewardPts = (event) => {
        const {name, value} = event.target;
        if (value > this.state.availableRewardPts) {
            alert("you don't have enough points!");
        } else {
            return this.setState({[name]: value});
        }
    }
    handleSubmitOrder = () => {
        const arrLen = Object.keys(this.state.foodToQty).length;
        const temp = new Array(arrLen);
        const foodToQtyCopy = this.state.foodToQty;
        let i = 0;
        for (var key in foodToQtyCopy) {
            temp[i] = {
                "fname": key,
                "rname": this.state.rname,
                "foodQty": foodToQtyCopy[key]
            }
            i++;
        }
        const arr = temp.filter(res => {
            return res.foodQty !== 0
        });
        console.log("arr:", arr);
        let param = {
            "userId": this.state.userId,
            "promoCode": this.state.selectedPromoCode,
            "applicableTo": this.state.rname,
            "deliveryLocation": this.state.chosenLocation,
            "usedRewardPoints": this.state.usedRewardPts,
            "contains": arr
        };
        console.log("param", param);
        fetch(`http://localhost:5000/customer/createOrder`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.userId,
                "promoCode": this.state.selectedPromoCode,
                "applicableTo": this.state.rname,
                "modeOfPayment": this.state.modeOfPayment,
                "deliveryLocation": this.state.chosenLocation,
                "usedRewardPoints": this.state.usedRewardPts,
                "contains": arr,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({orderId: json, orderedFood: arr}, this.handleRedirect)
            })
            .catch(err => console.error(err));

    }
    handleRedirect = () => {
        this.props.history.push({
            pathname: '/afterSubmitOrder',
            state:
                {
                    userId: this.state.userId,
                    orderId: this.state.orderId,
                    orderedFood: this.state.orderedFood,
                    rname: this.state.rname,
                    foodToQty: this.state.foodToQty,

                }
        })
    }
    handleUpdateCCinfo = () => {
        fetch(`http://localhost:5000/customer/updateCreditCardInfo`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.state.userId,
                ccinfo: this.state.creditCardInfo
            })
        })
            .then(res => res.json())
            .catch(err => err);
    }

    render() {
        const minOrderAmt = this.state.minOrderAmt;
        console.log("minOrderAmt",minOrderAmt);
        const rname = this.state.rname;
        const allFoodCopy = this.state.allFoodAndRes.slice();
        const foodToQtyCopy = this.state.foodToQty;
        const currentFoodCost = (Object.keys(foodToQtyCopy).reduce(function (previous, key) {
            return previous + foodToQtyCopy[key] * (allFoodCopy.filter(res => res.fname === key && res.rname === rname)[0].price)
        }, 0));
        const promoCodeCopy = this.state.promoCode.slice();
        console.log('qtyCopy', foodToQtyCopy);
        console.log("f&r", this.state.allFoodAndRes)
        const orderDetailsTemp = this.state.orderDetails.slice();
        console.log('foodCopy', allFoodCopy);
        const disabledSubmitButton =
            <React.Fragment>
                <Button variant="contained" color="primary" onClick={this.handleSubmitOrder} size="small" disabled>
                    Submit Order
                </Button>
                <br/>
                <h6>Please select at least one food item and make sure that your food cost > minimum order amount! </h6>
            </React.Fragment>
        ;
        const enabledSubmitButton =
            <Button variant="contained" color="primary" onClick={this.handleSubmitOrder} size="small">
                Submit Order
            </Button>
        ;
        return (
            <div>
                <AppBar style={{backgroundColor: "#ff3d00"}} position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Ordering From Restaurant : {this.state.rname}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {allFoodCopy.filter(res => {
                    return res.rname === this.state.rname;
                }).map(res => {
                    const currFname = res.fname;
                    return (
                        <ExpansionPanel style={{width: "95%"}}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Grid container spacing={2} direction="row" justify="space-between"
                                      alignItems="flex-start">
                                    <Grid item>
                                        <Typography style={{fontWeight: "bold"}}>
                                            {res.fname}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{fontWeight: "bold"}}>
                                            ${res.price}
                                        </Typography>
                                        <FormControl>
                                            <Input
                                                id="qty"
                                                name={currFname}
                                                value={foodToQtyCopy[currFname]}
                                                onChange={this.handleInputQty}
                                                endAdornment={<InputAdornment position="end">qty</InputAdornment>}
                                                aria-describedby="qty"
                                                inputProps={{
                                                    'aria-label': 'qty',
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={2} direction="column" justify="center"
                                      alignItems="flex-start">
                                    <span style={{fontStyle: "italic"}}>past reviews:</span>
                                    {orderDetailsTemp
                                        .filter(result => {
                                            return result.fname === res.fname
                                                && result.rname === this.state.rname
                                                && result.reviewcontent !== null
                                        })
                                        .map(result => {
                                            return (
                                                <div>{result.reviewcontent}</div>
                                            )
                                        })
                                    }
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })
                }
                <Paper style={{color: "green", fontWeight: 'bold', height: "50%"}}>
                    Total Cost:
                    ${currentFoodCost}
                    {this.state.usedRewardPts > 0
                    &&
                    currentFoodCost > 0
                    &&
                    (<span style={{color: "red"}}> - ${this.state.usedRewardPts / 5}
                        {" "} = {" "}
                        ${currentFoodCost - this.state.usedRewardPts / 5}
                    </span>)}
                    <br/> <br/>
                    Min Order Amount: {this.state.minOrderAmt}

                    <br/><br/>
                    <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                        <FormControl variant="filled" style={{width: "20%"}}>
                            <InputLabel>Mode Of Payment</InputLabel>
                            <Select
                                required
                                name="modeOfPayment"
                                value={this.state.modeOfPayment}
                                onChange={this.handleChange}

                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="credit">Credit Card</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        <Grid item>
                            {this.state.modeOfPayment === "creditcard" &&
                            <React.Fragment>
                                <FormControl variant="contained" style={{width: "100%"}}>
                                    <TextField
                                        name="creditCardInfo"
                                        label="creditCardInfo"
                                        placeholder="search for ... "
                                        value={this.state.creditCardInfo}
                                        onChange={this.handleChange}
                                    />
                                </FormControl>
                                <Button variant="outlined" color="primary" onClick={this.handleUpdateCCinfo}
                                        size="small">
                                    Update
                                </Button>
                            </React.Fragment>
                            }
                        </Grid>
                        <br/>
                        <br/>
                        <FormControl variant="outlined" style={{width: "50%"}}>
                            <InputLabel>Promo Code</InputLabel>
                            <Select
                                required
                                name="selectedPromoCode"
                                value={this.state.selectedPromoCode}
                                onChange={this.handleChange}
                            >
                                {promoCodeCopy.map(res => {
                                    return (
                                        <MenuItem value={res.promocode}>{res.promocode} - {res.promodesc}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl variant="filled" style={{width: "20%"}}>
                            <InputLabel>Use Reward Points</InputLabel>
                            <Select
                                required
                                name="usedRewardPts"
                                value={this.state.usedRewardPts}
                                onChange={this.handleRewardPts}

                            >
                                <MenuItem value={0}>0</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                    </Grid>
                </Paper>
                <br/><br/>
                <br/><br/>
                {console.log("minOrderAmt",minOrderAmt)}
                {minOrderAmt !== undefined && (Number(minOrderAmt.replace(/[^0-9.-]+/g, "")) <= currentFoodCost)
                    ? enabledSubmitButton
                    : disabledSubmitButton
                }
                <br/>
                <br/>
            </div>
        )
    }
}