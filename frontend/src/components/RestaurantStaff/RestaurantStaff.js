import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import history from './../../history';
import "./RestaurantStaff.css";
import { FormCreatePromoPage } from './FormCreatePromoPage';

export default class RestaurantStaff extends Component {

    constructor() {
        super();
        this.state = {
            curDivIndex: 0,//currently visible div index
        }
    }
    renderDiv = () => {
        switch (this.state.curDivIndex) {
            case 1: return <div>         <FormCreatePromoPage />    </div>
            case 2: return <div>       <h6>VIEW PROMOTION CAMPAIGN</h6>   </div>
            case 3: return <div>       <h6>CREATE PROMOTION CAMPAIGN</h6>   </div>
        }
        return null
    }
    setVisibleDiv = (index) => {
        this.setState({ curDivIndex: index })
    }


    render() {
        return (
            <div className="RestaurantStaff">
                <div className="lander">
                    <h1>CHOOSE YOUR ACTION</h1>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(1) }}>
                        VIEW SUMMARY INFORMATION
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(2) }}>
                        VIEW PROMOTION CAMPAIGN
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => { this.setVisibleDiv(3) }}>
                        CREATE PROMOTION CAMPAIGN
                    </Button>
                    {this.renderDiv()}
                </div>

            </div >
        );
    }
}
