import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Switch from '@material-ui/core/Switch';

export class customerBrowse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            chosenLocation: this.props.location.state.chosenLocation,
            area: this.props.location.state.area
        }
    }
    render() {
        return (
            <div>customer browse userId: {this.state.userId}, {this.state.area}, {this.state.chosenLocation}</div>
        )
    }
}
