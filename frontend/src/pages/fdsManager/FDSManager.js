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
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import OutlinedInput from "@material-ui/core/OutlinedInput";
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export class FDSManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            monthlyGeneralSummary: [],
            monthlyCustomerSummary: [],
            year: 2019,
            month: 1,
            day: 11,
            hour: 21,
            chooseMonthlySummary: false,
            customerOpen: false,
            riderOpen: false,
            orderOpen: false,
            filterCustomer: "",
            filterRider: "",
            monthlyRiderSummary: [],
            hourlyOrderInfo: [],
            otherActions: false,
            newMinOrderAmt:"",
            newArea:"",
            newRname: "",

        }
    }

    componentDidMount() {
        this.getMonthlyGeneralSummary();
        this.getMonthlyCustomerSummary();
        this.getMonthlyRiderSummary();
        this.getHourlyOrderInfo();
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }
    getMonthlyGeneralSummary = () => {
        fetch(`http://localhost:5000/fds/viewCustomerGeneralInfo?month=${encodeURIComponent(this.state.month)}&year=${encodeURIComponent(this.state.year)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({monthlyGeneralSummary: json[0]})
                console.log("generalsummary", this.state.monthlyGeneralSummary);
            })
            .catch(err => err);
    }
    getMonthlyRiderSummary = () => {
        fetch(`http://localhost:5000/fds/viewMonthRidersSummary?month=${encodeURIComponent(this.state.month)}&year=${encodeURIComponent(this.state.year)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({monthlyRiderSummary: json})
                console.log("MonthlyRiderSummary", this.state.monthlyRiderSummary);
            })
            .catch(err => err);
    }
    getMonthlyCustomerSummary = () => {
        fetch(`http://localhost:5000/fds/viewMonthlyCustomerSummary?month=${encodeURIComponent(this.state.month)}&year=${encodeURIComponent(this.state.year)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({monthlyCustomerSummary: json})
                console.log("monthlyCustomerSummary", this.state.monthlyCustomerSummary);
            })
            .catch(err => err);
    }

    getHourlyOrderInfo = () => {
        fetch(`http://localhost:5000/fds/viewHourlyOrderInfo?hour=${encodeURIComponent(this.state.hour)}&day=${encodeURIComponent(this.state.day)}&month=${encodeURIComponent(this.state.month)}&year=${encodeURIComponent(this.state.year)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({hourlyOrderInfo: json})
                console.log("hourlyOrderInfo", this.state.hourlyOrderInfo);
            })
            .catch(err => err);
    }
    handleMonthlySummary = () => {
        this.setState({chooseMonthlySummary: !this.state.chooseMonthlySummary})
    }
    handleCustomerToggle = () => {
        this.setState({customerOpen: !this.state.customerOpen});
    }
    handleRiderToggle = () => {
        this.setState({riderOpen: !this.state.riderOpen});
    }
    handleOrderToggle = () => {
        this.setState({orderOpen: !this.state.orderOpen});
    }
    handleOtherActionsToggle  = () => {
        this.setState({otherActions: !this.state.otherActions});
    }
    handleCreateRestaurant = () => {
        fetch(`http://localhost:5000/fds/insertRestaurant`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rname: this.state.newRname,
                minorderamt: this.state.newMinOrderAmt,
                area: this.state.newArea,
            })
        })
            .then(res => res.json())
            .then(json => {
                this.setState({ otherActions : false })
            })
            .catch(err => err);
        alert("Restaurant Created!");
    }

    render() {
        const hourArr = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,]
        const dayArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        console.log(monthArr);
        const customerDialog =
            <Dialog open={this.state.customerOpen} onClose={this.handleCustomerToggle} fullWidth="100">
                <FormControl variant="contained" style={{width: "100%"}}>
                    <TextField
                        name="filterCustomer"
                        label="Search Customer ID"
                        placeholder="search for ... "
                        value={this.state.filterCustomer}
                        onChange={this.handleChange}
                    />
                </FormControl>
                <br/><br/>
                <FormControl variant="outlined">
                    <InputLabel>Month</InputLabel>
                    <Select
                        required
                        name="month"
                        value={this.state.month}
                        onChange={this.handleChange}
                    >
                        {monthArr.map(res => {
                                return (
                                    <MenuItem value={res}>{res}</MenuItem>
                                )
                            }
                        )}
                    </Select>
                </FormControl>
                <br/>
                <FormControl variant="outlined">
                    <InputLabel>Year</InputLabel>
                    <Select
                        required
                        name="year"
                        value={this.state.year}
                        onChange={this.handleChange}
                    >

                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>

                    </Select>
                </FormControl>
                <Button variant="outlined" color="default" onClick={this.getMonthlyCustomerSummary}
                        size="large">
                    Go
                </Button>
                <DialogContent>
                    {this.state.monthlyCustomerSummary.filter(res => {
                        return res.userid.toString().includes(this.state.filterCustomer)
                    }).map(res => {
                        return (
                            <ExpansionPanel style={{width: "95%"}}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography style={{fontWeight: "bold"}}>
                                        Customer ID: {res.userid}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    Number Of Orders: {res.numorder} <br/>
                                    Total Cost Of Orders: ${res.totalordercost}
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })}
                </DialogContent>
            </Dialog>

        const riderDialog =
            <Dialog open={this.state.riderOpen} onClose={this.handleRiderToggle} fullWidth="100">
                <FormControl variant="contained" style={{width: "100%"}}>
                    <TextField
                        name="filterRider"
                        label="Search Rider ID"
                        placeholder="search for ... "
                        value={this.state.filterRider}
                        onChange={this.handleChange}
                    />
                </FormControl>
                <br/><br/>
                <FormControl variant="outlined">
                    <InputLabel>Month</InputLabel>
                    <Select
                        required
                        name="month"
                        value={this.state.month}
                        onChange={this.handleChange}
                    >
                        {monthArr.map(res => {
                                return (
                                    <MenuItem value={res}>{res}</MenuItem>
                                )
                            }
                        )}
                    </Select>
                </FormControl>
                <br/>
                <FormControl variant="outlined">
                    <InputLabel>Year</InputLabel>
                    <Select
                        required
                        name="year"
                        value={this.state.year}
                        onChange={this.handleChange}
                    >

                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>

                    </Select>
                </FormControl>
                <Button variant="outlined" color="default" onClick={this.getMonthlyCustomerSummary}
                        size="large">
                    Go
                </Button>
                <DialogContent>
                    {this.state.monthlyRiderSummary.filter(res => {
                        return res.userid.toString().includes(this.state.filterRider)
                    }).map(res => {
                        return (
                            <ExpansionPanel style={{width: "95%"}}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography style={{fontWeight: "bold"}}>
                                        Rider ID: {res.userid}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <div>
                                        <span
                                            style={{fontWeight: "bold"}}>Number Of Deliveries: </span>{res.numdelivery}
                                        <br/>
                                        <span
                                            style={{fontWeight: "bold"}}>Number Of Hours Worked: </span>{res.numhoursworked}
                                        <br/>
                                        <span style={{fontWeight: "bold"}}>Total Salary:</span> {res.totalsalary} <br/>
                                        <span
                                            style={{fontWeight: "bold"}}>Average Delivery Time:</span> ${res.avgtimedelivery}
                                        <br/>
                                        <span style={{fontWeight: "bold"}}>Number Of Ratings:</span> {res.numrating}
                                        <br/>
                                        <span style={{fontWeight: "bold"}}>Average Rating:</span> {res.avgrating} <br/>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })}
                </DialogContent>
            </Dialog>

        const orderDialog =
            <Dialog open={this.state.orderOpen} onClose={this.handleOrderToggle} fullWidth="100">
                <br/><br/>
                <FormControl variant="outlined">
                    <InputLabel>Hour</InputLabel>
                    <Select
                        required
                        name="hour"
                        value={this.state.hour}
                        onChange={this.handleChange}
                    >
                        {hourArr.map(res => {
                                return (
                                    <MenuItem value={res}>{res}</MenuItem>
                                )
                            }
                        )}
                    </Select>
                </FormControl>
                <br/>
                <FormControl variant="outlined">
                    <InputLabel>Day</InputLabel>
                    <Select
                        required
                        name="day"
                        value={this.state.day}
                        onChange={this.handleChange}
                    >
                        {dayArr.map(res => {
                                return (
                                    <MenuItem value={res}>{res}</MenuItem>
                                )
                            }
                        )}
                    </Select>
                </FormControl>
                <br/>
                <FormControl variant="outlined">
                    <InputLabel>Month</InputLabel>
                    <Select
                        required
                        name="month"
                        value={this.state.month}
                        onChange={this.handleChange}
                    >
                        {monthArr.map(res => {
                                return (
                                    <MenuItem value={res}>{res}</MenuItem>
                                )
                            }
                        )}
                    </Select>
                </FormControl>
                <br/>
                <FormControl variant="outlined">
                    <InputLabel>Year</InputLabel>
                    <Select
                        required
                        name="year"
                        value={this.state.year}
                        onChange={this.handleChange}
                    >

                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>

                    </Select>
                </FormControl>
                <Button variant="outlined" color="default" onClick={this.getHourlyOrderInfo}
                        size="large">
                    Go
                </Button>
                <DialogContent>
                    {this.state.hourlyOrderInfo.map(res => {
                        return (
                            <div>
                                <hr/>
                                <span
                                    style={{fontWeight: "bold"}}>Delivery Location: </span> {res.deliverylocation}
                                <br/>
                                <span style={{fontWeight: "bold"}}>Number Of Orders: </span> {res.numorder}
                                <hr/>
                            </div>

                        )
                    })}
                </DialogContent>
            </Dialog>
        return (
            <React.Fragment>
                {customerDialog}
                {riderDialog}
                {orderDialog}
                <AppBar style={{backgroundColor: "#ff3d00"}} position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            FDS Manager Actions - User Id: {this.state.userId}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <br/> <br/>
                <br/>
                <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                    <br/><br/>
                    <h1> Monthly Summary </h1>
                    <Button variant="contained" color="secondary" onClick={this.handleMonthlySummary}
                            size="large">
                        View Monthly Summary
                    </Button> <br/> <br/>
                    {this.state.chooseMonthlySummary &&
                    <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                        <Grid item>
                            <FormControl variant="outlined" style={{width: "100%"}}>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    required
                                    name="month"
                                    value={this.state.month}
                                    onChange={this.handleChange}
                                >
                                    {monthArr.map(res => {
                                            return (
                                                <MenuItem value={res}>{res}</MenuItem>
                                            )
                                        }
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl variant="outlined" style={{width: "100%"}}>
                                <InputLabel>Year</InputLabel>
                                <Select
                                    required
                                    name="year"
                                    value={this.state.year}
                                    onChange={this.handleChange}
                                >

                                    <MenuItem value={2019}>2019</MenuItem>
                                    <MenuItem value={2020}>2020</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Button variant="outlined" color="default" onClick={this.getMonthlyGeneralSummary}
                                size="large">
                            Go
                        </Button>
                        <br/><br/><br/>
                        <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                            <br/>
                            {this.state.monthlyGeneralSummary !== undefined &&
                            <Paper>
                                New Customers: {this.state.monthlyGeneralSummary.newcustomers}
                                <br/>
                                Number Of Orders: {this.state.monthlyGeneralSummary.numorder}
                                <br/>
                                Total Cost Of All Orders: {this.state.monthlyGeneralSummary.totalcost}
                            </Paper>
                            }
                            {this.state.monthlyGeneralSummary === undefined &&
                            <Paper>
                                New Customers: 0
                                <br/>
                                Number Of Orders: 0
                                <br/>
                                Total Cost Of All Orders: 0
                            </Paper>
                            }
                        </Grid>
                    </Grid>
                    }
                    <Button variant="contained" color="secondary" onClick={this.handleCustomerToggle}
                            size="large">
                        View Customer Summary
                    </Button> <br/> <br/>
                    <Button variant="contained" color="secondary" onClick={this.handleRiderToggle}
                            size="large">
                        View Rider Summary
                    </Button> <br/> <br/>
                    <h1> Hourly Summary </h1>
                    <Button variant="contained" color="secondary" onClick={this.handleOrderToggle}
                            size="large">
                        View Hourly Order Info
                    </Button> <br/> <br/>
                    <Button variant="outlined" color="primary" onClick={this.handleOtherActionsToggle}
                            size="large">
                        Other Actions
                    </Button> <br/> <br/>
                    {this.state.otherActions &&
                    <React.Fragment>
                        <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                            <Grid item style={{ width: "80%" }}>
                                <FormControl variant="outlined" style={{ width: "100%" }}>
                                <TextField
                                    required
                                    name="newRname"
                                    label="Required"
                                    helperText="Enter Restaurant Name"
                                    placeholder="Restaurant Name"
                                    variant="outlined"
                                    value={this.state.newRname}
                                    onChange={this.handleChange}
                                />
                                </FormControl>
                            </Grid>
                            <Grid item style={{ width: "80%" }}>
                                <FormControl variant="outlined" style={{ width: "100%" }}>
                                <TextField
                                    required
                                    name="newMinOrderAmt"
                                    label="Required"
                                    placeholder="ie. 20"
                                    helperText="Enter Minimum Order Amount"
                                    variant="outlined"
                                    value={this.state.newMinOrderAmt}
                                    onChange={this.handleChange}
                                />
                                </FormControl>
                            </Grid>
                            <Grid item style={{ width: "80%" }}>
                                <FormControl variant="outlined" style={{ width: "100%" }}>
                                    <InputLabel>Restaurant Area</InputLabel>
                                    <Select
                                        required
                                        name="newArea"
                                        value={this.state.newArea}
                                        onChange={this.handleChange}
                                    >
                                        <MenuItem value=""> --- Please select one ---</MenuItem>
                                        <MenuItem value="north">North</MenuItem>
                                        <MenuItem value="south">South</MenuItem>
                                        <MenuItem value="east">East</MenuItem>
                                        <MenuItem value="west">West</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br/>
                        <Button variant="contained" color="primary" onClick={this.handleCreateRestaurant}
                                size="large">
                            Create a Restaurant
                        </Button> <br/> <br/>
                    </React.Fragment>

                    }
                </Grid>
            </React.Fragment>
        )
    }
}
