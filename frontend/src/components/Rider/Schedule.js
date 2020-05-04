import React, { Component } from 'react';
import { FormAddSchedule } from './FormAddSchedule';
import { FormAddMWSchedule } from './FormAddMWSchedule';
import { FormViewSchedule } from './FormViewSchedule';
import { ViewScheduleTable } from './ViewScheduleTable';


import TextField from '@material-ui/core/TextField';



export class Schedule extends Component {

    state = {
        data: null,
        loading: false,
        showTable: false
    };

    loadData = async (month, year) => {
        this.setState({
            loading: true,
            showTable: true
        },
            function () { console.log("setState completed") }
        )
        await this.fetchData(month, year);
        this.setState({ loading: false });
    };

    fetchData = async (month, year) => {
        return fetch(`http://localhost:5000/rider/getPastMonthSchedule?userId=${this.props.userId}&month=${month}&year=${year}`, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ data: result })
                console.log(this.state.data);
            });
    };

    render() {
        return (
            <div style={{ "height": "100%" }}>
                <FormAddSchedule userId={this.props.userId} />
                <TextField
                    defaultValue=""
                    margin="normal"
                    fullWidth="true"
                />
                <FormAddMWSchedule />
                <TextField
                    defaultValue=""
                    margin="normal"
                    fullWidth="true"
                />
                <FormViewSchedule loadData={this.loadData} />
                <br />
                <ViewScheduleTable
                    loading={this.state.loading}
                    data={this.state.data}
                    showTable={this.state.showTable}
                    header={[
                        {
                            name: "Start Time",
                            prop: "starttime"
                        },
                        {
                            name: "End Time",
                            prop: "endtime"
                        },
                        {
                            name: "Duration",
                            prop: "intervalduration"
                        }
                    ]}
                />
            </div>
        )
    }
}

export default Schedule
