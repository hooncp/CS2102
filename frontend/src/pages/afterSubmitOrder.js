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


export class afterSubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            rname: this.props.location.state.rname,
            orderedFood: this.props.location.state.orderedFood,
            orderId: this.props.location.state.orderId,
            foodToReview: {},

        }
    }

    componentDidMount() {
        let temp = {};
        this.state.orderedFood.forEach(item => {
            temp = Object.assign({[item.fname]: ""}, temp);
        })
        this.setState({foodToReview: temp});
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
                reviews : arr,
            })
        })
            .then(res => res.json())
            .catch(err => err);
    }

    render() {
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
                <Grid container direction="column" alignContent="flex-start" justify="center">
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
                </Grid>
                <Button variant="outlined" color="primary" onClick={this.handleSubmitReview}
                        size="small">
                    Submit Review
                </Button>
            </React.Fragment>
        )
    }
}
