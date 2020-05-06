import React, { Component } from 'react';
import { FormSummary } from './FormSummary';

export class Summary extends Component {
    state = {
        month: "",
        year: "",
        numOfDelivery: "",
        avgTimeDelivery: "",
        numRating: "",
        avgRating: "",
        numHoursWorked: "",
        totalDeliveryFee: "",
        totalSalary: "",
        showResult: false
    }

    fetchData = async (month, year) => {
        return fetch(`http://localhost:5000/rider/viewMonthSummary?userId=${this.props.userId}&month=${month}&year=${year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({
                    month: result["0"]["work_month"],
                    year: result["0"]["work_year"],
                    numOfDelivery: result["0"]["numdelivery"],
                    avgTimeDelivery: result["0"]["avgtimedelivery"],
                    numRating: result["0"]["numrating"],
                    avgRating: result["0"]["avgrating"],
                    numHoursWorked: result["0"]["numhoursworked"],
                    totalDeliveryFee: result["0"]["total_delivery_fee"],
                    totalSalary: result["0"]["totalsalary"],
                    showResult: true
                })
            });
    };


    render() {
        if (!this.state.showResult) {
            return (
                <div>
                    <FormSummary userId={this.props.userId} fetchData={this.fetchData} />
                </div>
            )
        } else {
            return (
                <div>
                    <FormSummary userId={this.props.userId} fetchData={this.fetchData} />
                    <h2>Summary Information for Month : {this.state.month}, Year: {this.state.year}</h2>
                    <h3>Total Number of Deliveries : {this.state.numOfDelivery}</h3>
                    <h3>Average Time Taken for Deliveries : {this.state.avgTimeDelivery} minutes</h3>
                    <h3>Total Number of Ratings Received : {this.state.numRating}</h3>
                    <h3>Average Ratings Received : {this.state.avgRating}</h3>
                    <h3>Total Number of Hours Worked : {this.state.numHoursWorked}</h3>
                    <h3>Total Delivery Fee Received : {this.state.totalDeliveryFee}</h3>
                    <h3>Total Salary : {this.state.totalSalary}</h3>

                </div>
            )
        }
    }
}

export default Summary
