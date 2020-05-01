import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";

import history from './history';
import RestaurantStaff from "./components/RestaurantStaff/RestaurantStaff";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/RestaurantStaff" component={RestaurantStaff} />
                </Switch>
            </Router>
        )
    }
}