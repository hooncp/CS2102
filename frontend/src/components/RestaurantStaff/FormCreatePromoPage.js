import React, { Component } from 'react';
import FormPromoDetails from './FormPromoDetails.js';
import FormMinSpendingPromoDetails from './FormMinSpendingPromoDetails';

export class FormCreatePromoPage extends Component {
    state = {
        step: 1,
        promoCode: '',
        promoType: '',
        startDate: '',
        endDate: '',
    };

    // Proceed to next step
    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    };

    // Go back to prev step
    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    };

    // Handle fields change
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    };

    render() {
        const { step } = this.state;
        const { promoCode, promoType, startDate, endDate } = this.state;
        const values = { promoCode, promoType, startDate, endDate };

        switch (step) {
            case 1:
                return (
                    <FormPromoDetails
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        values={values}
                    />
                );
            case 2:
                return (
                    <FormMinSpendingPromoDetails
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        //handleChange={this.handleChange}
                        values={values}
                    />
                );
        }
    }
}

export default FormCreatePromoPage;