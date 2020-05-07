import React, { Component } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";

export class RiderAppBar extends Component {
    render() {
        return (
            <AppBar style={{backgroundColor: "#00838f"}} position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Rider Actions : ID #{this.props.userId}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}