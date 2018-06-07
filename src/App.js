import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  render() {
    return (
      <div>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              TeamWorks
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default App;
