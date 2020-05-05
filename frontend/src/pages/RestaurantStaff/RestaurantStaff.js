import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import "./RestaurantStaff.css";
import { Menu } from './Menu';
import { Promotion } from './Promotion';
import { Summary } from './Summary';


export default class RestaurantStaff extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            userType: this.props.location.state.userType,
            curDivIndex: 0//currently visible div index
            //userId: 86 //hardcode
        }
    }
    renderDiv = () => {
        switch (this.state.curDivIndex) {
            case 1: return <div style={{ "height": "1000px" }}><Promotion userId={this.state.userId} /></div>
            case 2: return <div style={{ "height": "1000px" }}><Menu userId={this.state.userId} />   </div>
            case 3: return <div style={{ "height": "1000px" }}><Summary userId={this.state.userId} /></div>
        }
        return null
    }
    setVisibleDiv = (index) => {
        this.setState({ curDivIndex: index })
    }


    render() {
        return (
            <div className="RestaurantStaff" style={{ "height": "1000px" }}>
                <div className="lander" style={{ "height": "1000px" }}>
                    <h1>CHOOSE YOUR ACTION</h1>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(1) }}>
                        PROMOTION
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(2) }}>
                        MENU
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
