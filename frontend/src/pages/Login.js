import React from "react";
import {Redirect} from "react-router-dom";
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



class Login extends React.Component {
    state = {
        newOrExistingUser: "unknown",
        userId: null,
        userType: null,
        userName: null,
        dataFetched: false,
        creditcardinfo: null,
        area: null,
        partTimeOrFullTime: null
    }
    setExistingUser = () => {
        this.setState({newOrExistingUser: "existing"});
    }

    setNewUser = () => {
        this.setState({newOrExistingUser: "new"});
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }
    handleLogin = () => {
        const userId = this.state.userId;
        fetch(`http://localhost:5000/general/getUserType?userId=${this.state.userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({userType: json}, this.handleRedirect)
            })
            .catch(err => err);
    }

    handleCreateAccount = () => {
        const userType = this.state.userType;
        switch (userType) {
            case "customer":
                fetch(`http://localhost:5000/customer/insertCustomer`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.state.userName,
                        creditcardinfo: null
                    })
                })
                    .then(res => res.json())
                    .then(json => {
                        this.setState({userType: "customer", userId: json}, this.handleRedirect)
                    })
                    .catch(err => err);
            case "rider":
                if (this.state.partTimeOrFullTime === "partTime") {
                    fetch(`http://localhost:5000/rider/insertPartTimeRider`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: this.state.userName,
                            area: this.state.area
                        })
                    })
                        .then(res => res.json())
                        .then(json => {
                            this.setState({userType: "rider"}, this.handleRedirect)
                        })
                        .catch(err => err);
                } else if (this.state.partTimeOrFullTime === "fullTime") {
                    fetch(`http://localhost:5000/rider/insertFullTimeRider`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: this.state.userName,
                            area: this.state.area
                        })
                    })
                        .then(res => res.json())
                        .then(json => {
                            this.setState({userType: "rider"}, this.handleRedirect)
                        })
                        .catch(err => err);
                }
            case"FM": //we dont have FM and RS insertion api
            case "RS":
            default:
                return null;
        }
    }

    handleRedirect = () => {
        let userType = this.state.userType;
        if (userType == "customer") {
            this.props.history.push({
                pathname: '/customerActions',
                state:
                    {
                        userId: this.state.userId,
                        userType: userType
                    }
            });
            // } else if (userType === "rider") {
            //     return <Redirect to="/customerActions"/>
            // } else if (userType === "RS") {
            //     return <Redirect to="/RSActions"/>
            // } else if (userType === "FM") {
            //     return <Redirect to="/FMActions"/>
        } else {
            console.log(userType);
        }
    }
    // checkUserType = () => {
    //     console.log(this.state.userType == "customer");
    //     return this.state.userType !== null;
    // }


    existingUserInput =
        <Grid container spacing={2} direction="row" justify="center" alignItems="center">
            <TextField
                required
                name="userId"
                label="Required"
                helperText="Enter your User ID"
                placeholder="User ID"
                variant="outlined"
                value={this.state.userId}
                onChange={this.handleChange}
            />
            <Button onClick={this.handleLogin}>
                Login
            </Button>
        </Grid>
    ;


    render() {
        return (
            <React.Fragment>
                <AppBar position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Food Delivery Service
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        WELCOME
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        Our very own Food Delivery Service founded by Chee Ping, Ee Jian, Wei Dong & Jit Yong
                    </Typography>
                    <div>
                        <br/> <br/>
                        <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.setExistingUser}>
                                    Existing user? Login here!
                                </Button>
                            </Grid>
                            <Grid item>
                                {this.state.newOrExistingUser === "existing" ? this.existingUserInput : null}
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="secondary" onClick={this.setNewUser}>
                                    New user? Create an account!
                                </Button>
                            </Grid>
                            <Grid item>
                                {this.state.newOrExistingUser === "new" &&
                                <Grid container spacing={2} direction="column" justify="center" alignItems="flex-start">
                                    <FormControl variant="outlined" style={{width: "100%"}}>
                                        <InputLabel>User Type</InputLabel>
                                        <Select
                                            required
                                            name="userType"
                                            value={this.state.userType}
                                            onChange={this.handleChange}
                                            input ={
                                                <OutlinedInput
                                                    label="User Type"
                                                    name="userType"
                                                    id="userType"
                                                />
                                            }
                                        >
                                            <MenuItem value=""> --- Please select one ---</MenuItem>
                                            <MenuItem value="customer">Customer</MenuItem>
                                            <MenuItem value="rider">Rider</MenuItem>
                                            <MenuItem value="RS">Restaurant Staff</MenuItem>
                                            <MenuItem value="FM">FDS Manager</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        required
                                        name="userName"
                                        label="Required"
                                        helperText="Enter your User Name"
                                        placeholder="User Name"
                                        variant="outlined"
                                        value={this.state.userName}
                                        onChange={this.handleChange}
                                    />
                                    <Button onClick={this.handleCreateAccount}>
                                        Create Account
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </React.Fragment>

        );
    }
}

export default Login;
