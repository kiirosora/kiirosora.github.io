import React, { Component } from 'react';
import MainLoadingScreen from './components/main-loading-screen';
import Header from './components/header';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  } 
  
  render() {
    return (
      <div id="app">
        { this.state.isLoading ? <MainLoadingScreen /> : null }
        <Header />
        
        <div>Main</div>
        
        <footer>Footer</footer>
      </div>
    );
  }
  
  componentDidMount() {
    console.log("-- App");
    this.setState({ isLoading: false });
  }
}

export default App;