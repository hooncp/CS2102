import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Grid";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


export class customerBrowse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            chosenLocation: this.props.location.state.chosenLocation,
            orderDetails: this.props.location.state.orderDetails,
            area: this.props.location.state.area,
            browsePref: "food",
            searchItem: "",
            allFood: [],
            allFoodAndRes: [],
            allRes: [],
            open: false,
            openedFood: "",
            foodPref: "all",

        }
    }

    componentDidMount() {
        this.getSameAreaFood();
        this.getSameAreaRestaurant();
        this.getSameAreaRestaurantAndFood();
    }
    getSameAreaFood = () => {
        fetch(`
        http://localhost:5000/customer/getSameAreaFood?area=${this.state.area}`,
            {
                method: 'GET',
                headers: {
                    'Accept':
                        'application/json',
                    'Content-Type':
                        'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(json => {
                this.setState({allFood: json})
                console.log('rs', this.state.allFoodAndRes)
            })
            .catch(err => err);
    }
    getSameAreaRestaurant = () => {
        fetch(`
        http://localhost:5000/customer/getSameAreaRestaurant?area=${this.state.area}`,
            {
                method: 'GET',
                headers: {
                    'Accept':
                        'application/json',
                    'Content-Type':
                        'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(json => {
                this.setState({allRes: json})
                console.log('rs', this.state.allRes)
            })
            .catch(err => err);
    }
    getSameAreaRestaurantAndFood = () => {
        fetch(`
        http://localhost:5000/customer/getSameAreaRestaurantAndFood?area=${this.state.area}`,
            {
                method: 'GET',
                headers: {
                    'Accept':
                        'application/json',
                    'Content-Type':
                        'application/json',
                }
            }
        )
            .then(res => res.json())
            .then(json => {
                this.setState({allFoodAndRes: json})
                console.log('rs&food', this.state.allFoodAndRes)
            })
            .catch(err => err);
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        return this.setState({[name]: value});
    }
    handleFoodInfo = (fname) => {
        this.setState({open: !this.state.open});
        this.setState({openedFood: fname});
    }
    handleToggle = () => {
        this.setState({open: !this.state.open});
    }
    handleChooseRestaurant = (rname) => {
        this.props.history.push({
            pathname: '/restaurantOrder',
            state:
                {
                    userId: this.state.userId,
                    area: this.state.area,
                    chosenLocation: this.state.chosenLocation,
                    orderDetails: this.state.foodDetails,
                    rname: rname,
                }
        });
    }
    render() {
        console.log("f1",this.state.allFood);
        const temp = this.state.allFood.slice();
        const foodCopy = Array.from(new Set(temp));
        const orderDetailsTemp = this.state.orderDetails.slice();
        const restaurantCopy = this.state.allRes.slice();
        console.log("food",foodCopy);
        const restaurantAndFoodCopy = this.state.allFoodAndRes.slice();
        const dialogtest =
            <Dialog open={this.state.open} onClose={this.handleToggle}>
                <DialogContent>
                    {restaurantAndFoodCopy.filter(res => {
                        return res.fname === this.state.openedFood;
                    }).map((res,i= 0) => {
                        return (
                            <div>
                                <hr/>
                                <Button variant="outlined" color="default" onClick={()=> this.handleChooseRestaurant(res.rname)} size="large">
                                <span style={{fontWeight:'bold'}}>{++i}. {res.rname}</span> <br/>
                                </Button>
                                <br/>
                                <span style={{fontStyle:"italic"}}>past reviews:</span>{orderDetailsTemp
                                    .filter(result =>
                                    {return result.fname === this.state.openedFood
                                        && result.rname === res.rname
                                        && result.reviewcontent !== null})
                                    .map(result => {
                                        return (
                                            <div>{result.reviewcontent}</div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                    }
                </DialogContent>
            </Dialog>
        return (
            <React.Fragment>
                {dialogtest}
                <AppBar style={{backgroundColor: "#ff3d00"}} position="relative">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Browse Food/Restaurants
                        </Typography>

                        <Grid container spacing={5} direction="row" justify="center" alignItems="flex-end">
                            <FormControl variant="filled" style={{width: "20%"}}>
                                <InputLabel style={{color: "white"}}>Browse Preference</InputLabel>
                                <Select style={{color: "white"}}
                                        required
                                        name="browsePref"
                                        value={this.state.browsepref}
                                        onChange={this.handleChange}

                                >
                                    <MenuItem value=""> --- Please select one ---</MenuItem>
                                    <MenuItem value="food">Browse by Food</MenuItem>
                                    <MenuItem value="restaurant">Browse by Restaurant</MenuItem>
                                </Select>
                            </FormControl>
                            {this.state.browsePref === "food" &&
                            <FormControl variant="filled" style={{width: "15%"}}>
                                <InputLabel style={{color: "white"}}>Food Preference</InputLabel>
                                <Select style={{color: "white"}}
                                        required
                                        name="foodPref"
                                        value={this.state.foodPref}
                                        onChange={this.handleChange}

                                >
                                    <MenuItem value=""> --- Please select one ---</MenuItem>
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="western">Western</MenuItem>
                                    <MenuItem value="chinese">Chinese</MenuItem>
                                    <MenuItem value="japanese">Japanese</MenuItem>
                                    <MenuItem value="korean">Korean</MenuItem>
                                    <MenuItem value="fusion">Fusion</MenuItem>
                                </Select>
                            </FormControl>
                            }
                            <FormControl variant="contained" style={{width: "10%"}}>
                                <TextField
                                    name="searchItem"
                                    label="Search"
                                    placeholder="search for ... "
                                    value={this.state.searchItem}
                                    onChange={this.handleChange}
                                />
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={this.handleSearch} size="small">
                                GO
                            </Button>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <br/> <br/>
                {console.log('copy', foodCopy)}
                {this.state.browsePref === "food" &&
                <GridList cellHeight={50} style={{backgroundColor: "white"}}>
                    <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                        <ListSubheader component="div">Food Items In Your Area</ListSubheader>
                    </GridListTile>
                    {foodCopy
                        .filter(
                            food=> {return food.category === this.state.foodPref
                                || this.state.foodPref === "all"
                                && food.fname.toLowerCase().includes(this.state.searchItem.toLowerCase())})
                        .map((food) => (
                        <GridListTile key={food.fname} style={{}}>
                            <GridListTileBar
                                style={{backgroundColor: "#e0f7fa"}}
                                title={<span style={{color: "black"}}>{food.fname}</span>}
                                actionIcon={
                                    <IconButton aria-label="go"
                                                onClick={() => this.handleFoodInfo(food.fname)}>
                                        <InfoIcon/>
                                    </IconButton>
                                }
                            />

                        </GridListTile>
                    ))}

                </GridList>
                }
                {this.state.browsePref === "restaurant" &&
                <GridList cellHeight={50} style={{backgroundColor: "white"}}>
                    <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                        <ListSubheader component="div">Restaurants In Your Area</ListSubheader>
                    </GridListTile>
                    {restaurantCopy
                        .filter(
                            res=> {return res.rname.toLowerCase().includes(this.state.searchItem.toLowerCase())})
                        .map((res) => (
                            <GridListTile key={res.rname} style={{}}>
                                <GridListTileBar
                                    style={{backgroundColor: "#cfd8dc"}}
                                    title={<span style={{color: "black"}}>{res.rname}</span>}
                                    actionIcon={
                                        <IconButton aria-label={`info about ${res.rname}`}
                                                    onClick={() => this.handleChooseRestaurant(res.rname)}>
                                            <ArrowForwardIcon/>
                                        </IconButton>
                                    }
                                />

                            </GridListTile>
                        ))}

                </GridList>
                }

            </React.Fragment>

        )
    }
}
