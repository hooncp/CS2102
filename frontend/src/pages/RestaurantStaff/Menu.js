import React, { Component } from 'react';
import { FormAddMenu } from './FormAddMenu';
import { FormDeleteMenu } from './FormDeleteMenu';
import { MenuTable } from './MenuTable';


export class Menu extends Component {
    state = {
        data: null,
        loading: true
    };

    reloadData = async () => {
        this.setState({ loading: true },
            function () { console.log("setState completed") }
        )
        await this.fetchData();
        this.setState({ loading: false });
    };

    fetchData = async () => {
        return fetch(`http://localhost:5000/rs/getMenu?userId=${this.props.userId}`, {
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

    async componentDidMount() {
        await this.fetchData();
        this.setState({ loading: false });
    };

    render() {
        return (
            <div style={{ "height": "100%" }}>
                <FormAddMenu reloadData={this.reloadData}
                    userId={this.props.userId} />
                <br />
                <FormDeleteMenu reloadData={this.reloadData}
                    userId={this.props.userId} />
                <br />
                <h2> Menu List</h2>
                <MenuTable
                    userId={this.props.userId}
                    loading={this.state.loading}
                    data={this.state.data}
                    header={[
                        {
                            name: "Food Item",
                            prop: "fname"
                        },
                        {
                            name: "Price",
                            prop: "price"
                        },
                        {
                            name: "Availability",
                            prop: "availability"
                        }
                    ]}
                />
            </div >
        )
    }
}

export default Menu
