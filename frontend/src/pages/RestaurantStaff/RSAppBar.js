import React, { Component } from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";

export class RSAppBar extends Component {
    render() {
        return (
            <AppBar style={{backgroundColor: "#039be5"}} position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Restaurant Staff Actions : ID #{this.props.userId}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}