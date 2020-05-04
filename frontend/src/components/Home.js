import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import history from './../history';
import "./Home.css";

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>WELCOME</h1>
                    <Button variant="contained"
                        color="primary"
                        onClick={() => history.push('/RestaurantStaff')}>
                        RESTAURANT STAFF
                    </Button>
                    <Button variant="contained"
                        color="primary"
                        onClick={() => history.push('/Rider')}>
                        RIDER
                    </Button>
                </div>

            </div >
        );
    }
}