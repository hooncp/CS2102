import React from "react";

export class customerActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            userType: this.props.location.state.userType
        }
    }
    render() {
        {
            console.log(this.props);
        }
        return (
            <div>Inside customer actions: userId: {this.state.userId}</div>
        )
    }
}

export default customerActions;
