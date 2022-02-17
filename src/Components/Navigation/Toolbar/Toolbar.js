import React, { Component } from "react";
import { NavLink,withRouter } from "react-router-dom";
import './Toolbar.css';
import { connect } from "react-redux";
import * as actions from '../../../Store/Actions/index';

class Toolbar extends Component{
        state = {
        isMenuClicked: false
    }

    onLogoutClickedHandler = () => {
        this.props.history.push("/");
        this.props.onLogoutClicked(0);
    }
    render() {
        
        return (
            <header className="Toolbar">
                <nav>
                    <span>Driver System</span>
                    <div className="NavItems">
                    <NavLink to="/addDriver" onClick={() => this.props.history.push('/addDriver')}>Add Driver</NavLink>
                    <NavLink to="/showDrivers" onClick={() => this.props.history.push('/showDrivers')}>Show Drivers</NavLink>
                    </div>
                    <div className="CornerItems">
                    <p onClick={() => this.onLogoutClickedHandler()} className="MenuItems">Logout</p>
                    </div>
                </nav>
            </header>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLogoutClicked: (expirationTime) => dispatch(actions.setExpirationTime(expirationTime))
    }
}
export default withRouter(connect(null,mapDispatchToProps)(Toolbar));