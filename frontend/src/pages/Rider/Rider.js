import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import "./Rider.css";
import { Schedule } from './Schedule';
import { Summary } from './Summary';
import { Order } from './Order';
import {RiderAppBar} from "./RiderAppBar";


export default class Rider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curDivIndex: 0,//currently visible div index
            //userId: 41 //hardcode
            userId: this.props.location.state.userId,
            userType: this.props.location.state.userType

        }
    }
    handleClose = () => {
        this.setState({ curDivIndex: 0 });
    };

    renderDiv = () => {
        switch (this.state.curDivIndex) {
            case 1: return <div style={{ "height": "1000px" }}> <Schedule userId={this.state.userId} handleClose={this.handleClose} /></div>
            case 2: return <div style={{ "height": "1000px" }}> <Order userId={this.state.userId} handleClose={this.handleClose} /></div>
            case 3: return <div style={{ "height": "1000px" }}> <Summary userId={this.state.userId} handleClose={this.handleClose} /></div>
        }
        return null
    }
    setVisibleDiv = (index) => {
        this.setState({ curDivIndex: index })
    }


    render() {
        return (
            <div className="Rider" style={{ "height": "1000px" }}>
                <RiderAppBar userId={this.state.userId}/>
                <div className="lander" style={{ "height": "1000px" }}>
                    <h1>CHOOSE YOUR ACTION</h1>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(1) }}>
                        SCHEDULE
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(2) }}>
                        ORDERS
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(3) }}>
                        SUMMARY
                    </Button>
                    {this.renderDiv()}
                </div>

            </div >
        );
    }
}
