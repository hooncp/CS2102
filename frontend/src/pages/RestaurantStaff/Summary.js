import React, { Component } from 'react';
import { FormViewSummary } from './FormViewSummary';


export class Summary extends Component {
    state = {
        month: "",
        year: "",
        monthlyCompletedOrder: "",
        monthlyCostofCompletedOrder: "",
        topFiveFood: "",
        showResult: false
    };

    fetchTopFiveFood = async (month, year) => {
        return fetch(`http://localhost:5000/rs/getMonthlyTop5Food?userId=${this.props.userId}&month=${month}&year=${year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ topFiveFood: result })
                console.log(this.state.topFiveFood);
            });
    };

    fetchMonthlyCostofCompletedOrder = async (month, year) => {
        return fetch(`http://localhost:5000/rs/getMonthlyCostofCompletedOrder?userId=${this.props.userId}&month=${month}&year=${year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ monthlyCostofCompletedOrder: result })
                console.log(this.state.monthlyCostofCompletedOrder);
            });
        return;
    };


    fetchMonthlyCompletedOrder = async (month, year) => {
        return fetch(`http://localhost:5000/rs/getMonthlyCompletedOrder?userId=${this.props.userId}&month=${month}&year=${year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ monthlyCompletedOrder: result })
                console.log(this.state.monthlyCompletedOrder);
            });
    };

    fetchData = async (month, year) => {
        await this.fetchMonthlyCompletedOrder(month, year);
        await this.fetchMonthlyCostofCompletedOrder(month, year);
        await this.fetchTopFiveFood(month, year);
        this.setState({
            month: month,
            year: year,
            showResult: true
        });
    };

    renderDiv = () => {
        if (this.state.showResult) {
            return (
                <div>
                    <h2>Summary Information for Month : {this.state.month} Year : {this.state.year}</h2>
                    <h3>Total Number of Completed Order : {this.state.monthlyCompletedOrder}</h3>
                    <h3>Total Cost of Completed Order : ${this.state.monthlyCostofCompletedOrder}</h3>
                    <h3>Top 5 Foods :</h3>
                    {this.state.topFiveFood.map((food) => (
                        <h3>Food Item : {food[0]} | Quantity Ordered : {food[1]}</h3>
                    ))}
                </div>
            );
        }
        return null;
    }


    render() {
        return (
            <div>
                <FormViewSummary userId={this.props.userId} fetchData={this.fetchData} />
                {this.renderDiv()}
            </div>
        );

    }
}

export default Summary
