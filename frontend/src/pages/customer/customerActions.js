import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export class customerActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            userType: this.props.location.state.userType,
            makeNewOrder: false,
            viewPastOrder: false,
            area: "",
            chooseFromPrevOrders: true,
            pastFiveLoc: [],
            chosenLocation: "",
            pastOrders: [],
            foodDetails: [],
        }
    }

    componentDidMount() {
        fetch(`http://localhost:5000/customer/getPrevDeliveryLoc?userId=${this.state.userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                // let temp = this.state.pastFiveLoc.slice();
                // temp = json;
                this.setState({pastFiveLoc: json}, this.handleRedirect)
                // this.state.pastFiveLoc.forEach(location => {
                //     console.log(location.deliverylocation)
                // })
            })
            .catch(err => err);
        fetch(`http://localhost:5000/customer/viewPastOrders?userId=${this.state.userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({pastOrders: json}, this.handleRedirect)
                console.log(this.state.pastOrders)
            })
            .catch(err => err);
        fetch(`http://localhost:5000/customer/viewAllContainsDetail`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({foodDetails: json}, this.handleRedirect)
                console.log(this.state.foodDetails)
            })
            .catch(err => err);
    }

    hamdleViewPastOrders = () => {
        this.setState({viewPastOrder: true, makeNewOrder: false});
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }
    handleToggle = (event) => {
        const {name, checked} = event.target;
        return this.setState({[name]: checked});
    }

    handleMakeNewOrder = () => {
        this.setState({makeNewOrder: true, viewPastOrder: false});
    }

    handleGO = () => {
        this.props.history.push({
            pathname: '/customerBrowse',
            state:
                {
                    userId: this.state.userId,
                    area: this.state.area,
                    chosenLocation: this.state.chosenLocation,
                    orderDetails: this.state.foodDetails
                }
        });
    }


    render() {
        const foodDetailsCopy = this.state.foodDetails.slice();
        const pastOrdersView = this.state.pastOrders.map(orderDetails => {
            return (
                <ExpansionPanel style={{width: "95%"}}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={{fontWeight: "bold"}}> Order ID: {orderDetails.orderid}
                            {"  "} || {"   "}
                            Restaurant name: {orderDetails.rname}
                            {"   "} || {"  "}
                            Date: {orderDetails.timeoforder.substring(0, 10)}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={2} direction="column" justify="center" alignItems="flex-start">
                            <Grid item>
                                <Typography>
                                    <hr/>
                                    Final price: ${orderDetails.finalprice} (Delivery Fee: ${orderDetails.deliveryfee})
                                    <br/> <br/>
                                    {" "} Earned Reward Points: {orderDetails.earnedrewardpts} points
                                    <br/> <br/>
                                    {" "} Used Reward Points: {orderDetails.usedrewardpoints} points
                                    <hr/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                {foodDetailsCopy
                                    .filter(record => {
                                        return (record.orderid === orderDetails.orderid)
                                    })
                                    .map((record, i) => {
                                        return (
                                            <Typography>
                                                Food Item: {record.fname} x {record.foodqty}
                                            </Typography>

                                        )
                                    })}
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        })
        console.log("pastorder:", pastOrdersView);
        return (
            <React.Fragment>
                <AppBar style={{backgroundColor: "#ff3d00"}} position="relative">
                    <Toolbar>

                        <Typography variant="h6" color="inherit" noWrap>
                            Customer Actions - User Id: {this.state.userId}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <br/><br/>
                <div>
                    <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={this.handleMakeNewOrder} size="large">
                                Make new order!
                            </Button>
                        </Grid>
                        {this.state.makeNewOrder &&
                        <React.Fragment>
                            <h2> Where are you ordering to?</h2>
                            <Grid item style={{width: "80%"}}>
                                <FormControl variant="outlined" style={{width: "100%"}}>
                                    <InputLabel>Delivery Area</InputLabel>
                                    <Select
                                        required
                                        name="area"
                                        value={this.state.area}
                                        onChange={this.handleChange}
                                        input={
                                            <OutlinedInput
                                                label="area"
                                                name="area"
                                                id="area"
                                            />
                                        }
                                    >
                                        <MenuItem value=""> --- Please select one ---</MenuItem>
                                        <MenuItem value="north">North</MenuItem>
                                        <MenuItem value="south">South</MenuItem>
                                        <MenuItem value="east">East</MenuItem>
                                        <MenuItem value="west">West</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item style={{width: "80%"}}>
                                <span> Choose From Previously Delivered Locations </span>
                                <Switch
                                    checked={this.state.chooseFromPrevOrders}
                                    onChange={this.handleToggle}
                                    name="chooseFromPrevOrders"
                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                />
                            </Grid>
                            {this.state.chooseFromPrevOrders &&
                            <React.Fragment>
                                <FormControl variant="outlined" style={{width: "80%"}}>
                                    <InputLabel>Past Five Addresses </InputLabel>
                                    <Select
                                        required
                                        name="chosenLocation"
                                        value={this.state.chosenLocation}
                                        onChange={this.handleChange}
                                    >
                                        <MenuItem value=""> --- Please select one ---</MenuItem>
                                        {this.state.pastFiveLoc[0] !== undefined &&
                                        this.state.pastFiveLoc.map(res => {
                                                return (
                                                    <MenuItem value={res.deliverylocation}>{res.deliverylocation}</MenuItem>
                                                )
                                            }
                                        )
                                        }
                                    </Select>
                                </FormControl>
                            </React.Fragment>
                            }
                            {!this.state.chooseFromPrevOrders &&
                            <FormControl variant="outlined" style={{width: "80%"}}>
                                <TextField
                                    name="chosenLocation"
                                    label="Enter New Delivery Address"
                                    placeholder="Address"
                                    variant="outlined"
                                    value={this.state.chosenLocation}
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                            }
                            <br/>
                            {this.state.chosenLocation !== "" && this.state.area !== "" ?
                                <Button variant="outlined" color="primary" onClick={this.handleGO} size="medium">
                                    GO
                                </Button>
                                :
                                <React.Fragment>
                                <Button variant="outlined" color="primary" onClick={this.handleGO} size="medium" disabled>
                                    GO
                                </Button>
                                <h6>Please choose the area and location to deliver to</h6>
                                </React.Fragment>
                            }
                        </React.Fragment>
                        }
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={this.hamdleViewPastOrders}
                                    size="large">
                                View past orders
                            </Button>
                        </Grid>
                        {this.state.viewPastOrder && (pastOrdersView.length === 0 ? "None" : pastOrdersView)}

                    </Grid>
                </div>
            </React.Fragment>
        )
    }
}

export default customerActions;
