import React, {Component} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';


export class RiderAppBar extends Component {
    handleHome = () => {
        this.props.history.push({
            pathname: '/'
        })
    }

    render() {
        return (
            <AppBar style={{backgroundColor: "#00838f"}} position="relative">
                <Toolbar>
                    <Grid container spacing={1} direction="row" justify="space-between" alignItems="center">
                        <Typography variant="h6" color="inherit" noWrap>
                            Rider Actions : ID #{this.props.userId}
                        </Typography>
                        <Button color="inherit" onClick={this.handleHome}> HOME </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
        )
    }
}