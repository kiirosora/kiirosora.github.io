import React, { Component } from 'react';
import './main-loading-screen.css';

class MainLoadingScreen extends Component {
  render() {
    return (
      <div id="main-loading-screen">
          <div className="hexagon main">
            <div className="shadow1"></div>
            <div className="hexagon shadow2"></div>
            <div className="hexagon shadow3"></div>
            <div className="hexagon shadow4"></div>
          </div>
      </div>
    );
  }
  
  componentDidMount() {
    console.log("-- MainLoadingScreen");
  }
}

export default MainLoadingScreen;