import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import "webix/webix.js";
import "webix/skins/compact.css";

class Sidebar extends Component {
  render() {
    return <div ref="sidebarRoot" style={{ height: "100%", width: "100%" }} />;
  }

  componentDidMount() {
    let treeDef = {
      view: "tree",
      id: "data-list",
      select: false,
      darg: "source"
    };
    let workspaceDef = {
      template: "<div>workspace</div>"
    };
    let dataGridDef = {
      view: "datatable",
      id: "data-preview",
      autoConfig: true
    };

    this.ui = window.webix.ui({
      container: ReactDOM.findDOMNode(this.refs.sidebarRoot),
      cols: [
        treeDef,
        { view: "resizer" },
        { rows: [workspaceDef, { view: "resizer" }, dataGridDef] }
      ]
    });
  }

  componentWillUnmount() {
    this.ui.destructor();
    this.ui = undefined;
  }
}
export default Sidebar;
