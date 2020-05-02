import React, { Component } from 'react'

export class SummaryResult extends Component {
    state = {
        monthlyCompletedOrder: null
    };


    componentDidMount() {
        fetch(`http://localhost:5000/rs/getMonthlyCompletedOrder?userId=${this.props.values.userId}&month=${this.props.values.month}&year=${this.props.values.year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => { response.json() })
            .then(result => {
                console.log(result);
                this.setState({ monthlyCompletedOrder: result })
            });
    }

    render() {
        return (
            <div>
                Display Result...
            </div>
        )
    }
}

export default SummaryResult
