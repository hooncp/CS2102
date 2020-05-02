import React, { Component } from 'react';
import FormSummaryInfo from './FormSummaryInfo.js';
import SummaryResult from './SummaryResult';

export class SummaryInfo extends Component {
    state = {
        step: 1,
        month: '',
        year: '',
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
        const { month, year } = this.state;
        const values = { month, year };

        switch (step) {
            case 1:
                return (
                    <FormSummaryInfo
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        values={values}
                    />
                );
            case 2:
                return (
                    <SummaryResult
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        values={values}
                    />
                );
        }
    }
}

export default SummaryInfo;