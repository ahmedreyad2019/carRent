import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DirectionsCar from"@material-ui/icons/DirectionsCar"
import NavBar from "../Navbar";
import ViewList from "@material-ui/icons/ViewList";
import Identity from "@material-ui/icons/Person";
import Home from "@material-ui/icons/Home";
import Upload from "@material-ui/icons/CloudUpload";
import Add from "@material-ui/icons/PersonAdd";
// import LinearDeterminate from "../loading/CustomizedProgress";
import { connect } from "react-redux";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import EditProfile from "@material-ui/icons/BorderColor";
import RegisterAdmin from "../pages/RegisterAdmin";
import RegisterModerator from "../pages/RegisterModerator";
import ViewAdmins from "../pages/ViewAdmins";
import ViewModerators from "../pages/ViewModerators";
import ViewLicenses from "../pages/ViewLicenses";
import ViewCarLicenses from "../pages/ViewCarLicenses";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex",
    zIndex: -1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#103755"
  },
  content: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar
});

class ClippedDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: "CV",
      mobileOpen: false,
      drawerOpen: false
    };
  }
  handleLoading = () => {
  //  if (sessionStorage.getItem("loading")) return <LinearDeterminate />;
  };
  handleContent = state => {
    switch (state.clicked) {
      case "AC":
        return (
         <RegisterAdmin/>
        );
      case "MC":
        return (
            <RegisterModerator/>
        );
      case "CV":
        return (
          <ViewCarLicenses/>
        );
      case "DV":
        return (
          <ViewLicenses/>
        );
    default:return   <div></div>
    }
  };
  handleLicenseView = () => {
    this.setState({ clicked: "DV" });
    this.handleDrawerClose();
  };

  handleCarLicenseView = () => {
    this.setState({ clicked: "CV" });
    this.handleDrawerClose();
  };
  handleModeratorC = () => {
    this.setState({ clicked: "MC" });
    this.handleDrawerClose();
  };
  handleModeratorV = () => {
    this.setState({ clicked: "MV" });
    this.handleDrawerClose();
  };
 
  handleDrawerToggle = () => {
    this.setState(prevState => {
      return { drawerOpen: !prevState.drawerOpen };
    });
  };
  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handelOpen = () => {
    this.setState({ mobileOpen: localStorage.getItem("openDrawer") });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar handleDrawerToggle={this.handleDrawerToggle} />
        <div className={classes.toolbar} />
        <Drawer
          className={classes.drawer}
          variant={"temporary"}
          open={this.state.drawerOpen}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <ClickAwayListener onClickAway={this.handleDrawerClose}>
          <List>
            

            <ListItem button key={"Create Lawyer"} onClick={this.handleLicenseView}>
              <ListItemIcon>
                <Identity />
              </ListItemIcon>
              <ListItemText
                primary={
                    <b style={{ color: "#ffffff" }}>
                      {
                  sessionStorage.getItem("lang") === "en"
                    ? "View Driving Licenses"
                    : "محامي جديد"
                }
                  </b>
                  }
              />
            </ListItem>
            <ListItem
              button
              key={"Create Reviewer"}
              onClick={this.handleCarLicenseView}
            >
              <ListItemIcon>
                <DirectionsCar />
              </ListItemIcon>
              <ListItemText
                primary={
                    <b style={{ color: "#ffffff" }}>
                      {
                  sessionStorage.getItem("lang") === "en"
                    ? "View Car Licenses"
                    : "مراجع جديد"
                }
                  </b>
                  }
              />
            </ListItem>
            
          </List>
          </ClickAwayListener>
        </Drawer>
        <main className={classes.content} style={{ marginTop: 50 }}>
          {this.handleLoading}
          {this.handleContent(this.state)}
          <div className={classes.toolbar} />
        </main>
      </div>
    );
  }
}
ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  drawerOpen: state.drawerState.drawerOpen
});

const mapDispatchToProps = dispatch => ({});
export default (withStyles(styles)(ClippedDrawer));
