import React, { Component } from 'react';
import { FormAddPromotion } from './FormAddPromotion';
import { FormViewPromotion } from './FormViewPromotion';


export class Promotion extends Component {
    state = {
        promoCode: "",
        ordersReceivedDuringPromotion: "",
        duration: "",
        startDate: "",
        endDate: "",
        showResult: false
    }

    fetchOrdersReceivedDuringPromotion = async (promoCode) => {
        return fetch(`http://localhost:5000/rs/getOrdersReceivedDuringPromotion?userId=${this.props.userId}&promoCode=${promoCode}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ ordersReceivedDuringPromotion: result })
                console.log(this.state.ordersReceivedDuringPromotion);
            });
    };

    fetchPromotionDuration = async (promoCode) => {
        return fetch(`http://localhost:5000/rs/getPromotionDuration?userId=${this.props.userId}&promoCode=${promoCode}`, {
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
                    duration: result["0"]["durationofpromotion"],
                    startDate: result["0"]["startdate"],
                    endDate: result["0"]["enddate"]
                })
            });
    };

    fetchData = async (promoCode) => {
        await this.fetchOrdersReceivedDuringPromotion(promoCode);
        await this.fetchPromotionDuration(promoCode);
        this.setState({
            showResult: true,
            promoCode: promoCode
        });
    };

    renderDiv = () => {
        if (this.state.showResult) {
            return (
                <div>
                    <h2>Summary Information for PromoCode : {this.state.promoCode} </h2>
                    <h3>Total Number of Orders : {this.state.ordersReceivedDuringPromotion}</h3>
                    <h3>Duration : {this.state.duration} Days </h3>
                    <h3>Start Date : {this.state.startDate}</h3>
                    <h3>End Date : {this.state.endDate}</h3>
                </div>
            );
        }
        return null;
    }


    render() {
        return (
            <div>
                <FormAddPromotion userId={this.props.userId} />
                <FormViewPromotion userId={this.props.userId} fetchData={this.fetchData} />
                {this.renderDiv()}
            </div>
        );

    }
}

export default Promotion
