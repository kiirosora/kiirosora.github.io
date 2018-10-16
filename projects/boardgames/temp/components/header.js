import React, { Component } from 'react';
import './header.css';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="container">
          <h1 id="title">MeepleMate</h1>
        </div>
      </header>
    );
  }
  
  componentDidMount() {
    console.log("-- Header");
  }
}

export default Header;