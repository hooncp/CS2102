import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import customerActions from "./pages/customer/customerActions";
import { customerBrowse } from "./pages/customer/customerBrowse";
import { restaurantOrder } from "./pages/customer/restaurantOrder";
import { afterSubmitOrder } from "./pages/customer/afterSubmitOrder";
import { FDSManager } from "./pages/fdsManager/FDSManager";
import RestaurantStaff from "./pages/RestaurantStaff/RestaurantStaff";
import Rider from "./pages/Rider/Rider";



export default class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/customerActions" exact component={customerActions} />
                        <Route path="/customerBrowse" exact component={customerBrowse} />
                        <Route path="/restaurantOrder" exact component={restaurantOrder} />
                        <Route path="/afterSubmitOrder" exact component={afterSubmitOrder} />
                        <Route path="/FDSManager" exact component={FDSManager} />
                        <Route path="/RestaurantStaff" exact component={RestaurantStaff} />
                        <Route path="/Rider" exact component={Rider} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
