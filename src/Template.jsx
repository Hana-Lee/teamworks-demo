/**
 * 공통으로 사용하는 템플릿
 */
import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Sidebar from "./Sidebar.jsx";

import Main1 from "./Main1";
import Main2 from "./Main2";
import Main3 from "./Main3";

const styles = theme => ({
  root : {
    flexGrow : 1
  },
  whiteLabel: {
    color: "#fff"
  },
  flex: {
    flex: 1
  }
});

class Template extends Component {
  state = {
    selectedView: "main1"
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value
    });
  };

  render() {
    let content = null;
    const { classes } = this.props;
    const { selectedView } = this.state;

    switch (this.state.selectedView) {
      case "main1":
        content = <Main1 />;
        break;
      case "main2":
        content = <Main2 />;
        break;
      case "main3":
        content = <Main3 />;
        break;
      default:
        break;
    }
    return (
      <div className={classes.root}>
      <Grid container direction="column">
      <Grid item xs>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Grid container>
              <Grid item xs container alignItems="center">
                <Typography variant="title" color="inherit">
                  TeamWorks
                </Typography>
              </Grid>
              <Grid item xs container justify="center">
                <RadioGroup
                  name="viewSelector"
                  aria-label="viewSelector"
                  value={selectedView}
                  onChange={this.handleChange("selectedView")}
                  row
                >
                  <FormControlLabel
                    classes={{ label: classes.whiteLabel }}
                    value="main1"
                    control={<Radio />}
                    label="Sample1"
                  />
                  <FormControlLabel
                    classes={{ label: classes.whiteLabel }}
                    value="main2"
                    control={<Radio />}
                    label="Sample2"
                  />
                  <FormControlLabel
                    classes={{ label: classes.whiteLabel }}
                    value="main3"
                    control={<Radio />}
                    label="Sample3"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs />
            </Grid>
          </Toolbar>
        </AppBar>
        </Grid>
          <Grid item xs>
            <div style={{background:'red'}}>workspace</div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Template.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Template);
