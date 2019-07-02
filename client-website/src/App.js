import React, { Component } from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import SignIn from "./components/pages/SignIn";
import RegisterAdmin from "./components/pages/RegisterAdmin";
import RegisterModerator from "./components/pages/RegisterModerator";
import ViewAdmins from "./components/pages/ViewAdmins";
import ViewModerators from "./components/pages/ViewModerators";
import AdminDrawer from "./components/drawers/AdminDrawer";
import Navbar from "./components/Navbar";
import ModeratorDrawer from "./components/drawers/ModeratorDrawer";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  
  render() {
    const { classes } = this.props;
    sessionStorage.setItem('lang', "en")
    console.log("my token"+sessionStorage.getItem("jwtToken")+"===="+ sessionStorage.getItem('type'))
    return (
      <Router>
      <React.Fragment>
        <Navbar/>
      <Route exact path="/" component={SignIn} />
      {/* <Route exact path="/profile" component={()=>{if(sessionStorage.getItem("jwtToken")!=null&&sessionStorage.getItem("auth")){
          return(<AdminDrawer/>)
      }else{
        console.log("you should sign in")
        return(<signIn/>)
      }}}/> */}


<Route
              exact
              path="/Profile"
              component={() =>
                sessionStorage.getItem('auth') &&
                sessionStorage.getItem('type') === 'a' ? (
                  <AdminDrawer />
                ) : sessionStorage.getItem('auth') &&
                sessionStorage.getItem('type') === 'm' ? <ModeratorDrawer/>:(
                  <SignIn />
                )
              }
            />

      {/* <Route exact path="/signUpAdmin" component={RegisterAdmin} />
      <Route exact path="/signUpModerator" component={RegisterModerator} />
      <Route exact path="/viewAdmins" component={ViewAdmins} />
      <Route exact path="/viewModerators" component={ViewModerators} /> */}
      </React.Fragment>
      </Router>
    );
  }
}


export default App;
