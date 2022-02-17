import React, { Component } from 'react';
import './App.css';
import Toolbar from './Components/Navigation/Toolbar/Toolbar';
import { Route, Switch, withRouter } from 'react-router-dom';
import Auth from './Components/Auth/Auth';
import AddDriver from './Components/AddDriver/AddDriver';
import ShowDrivers from './Components/ShowDrivers/ShowDrivers';
import { connect } from 'react-redux';
class App extends Component {
  render() {
    console.log(this.props.isAuthenticated);
    let routes = null;
    if(this.props.isAuthenticated){
      routes = <Switch>
        <Route path='/' exact>
          <ShowDrivers />
        </Route>
        <Route path='/addDriver' exact> <AddDriver {...this.props}/>
          </Route>
        <Route path='/showDrivers' exact> <ShowDrivers {...this.props}/></Route>
      </Switch>
    }
    else {
      routes = <Switch>
        <Route path='/' exact >
          <Auth />
        </Route>
        <Route path='*' exact >
          <Auth/>
        </Route>
      </Switch>
    }
    return (
      <div className="App">
        {this.props.isAuthenticated ? <Toolbar  {...this.props}/> : null}
        {routes}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
  }
}
export default withRouter(connect(mapStateToProps)(App));