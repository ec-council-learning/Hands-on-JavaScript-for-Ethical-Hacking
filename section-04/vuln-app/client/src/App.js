import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      details: { startsWith: "", length: "" }
    };
  }

  render() {
    return (<div style={{ textAlign: 'center' }}>
      <header>
        {this.getHeader()}
        <input id="name" value={this.state.inputName} onChange={e => this.updateInputName(e)} placeholder="Your name"></input>
        <button onClick={this.handleSave}>Save</button>
      </header>
    </div>);
  }

  getHeader() {
    return (this.state.name ? (<p>
      Hi, {this.state.name} your name is {this.state.details.length} characters long and starts with a letter '{this.state.details.startsWith}'
    </p>) : (<p>
      Hi, enter your name here:
    </p>));
  }

  updateInputName = (e) => {
    this.setState({
      inputName: e.target.value
    });
  };

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };

    fetch(
      "http://localhost:3003/", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        this.setState(
          {
            name: json.name,
            details: {
              startsWith: json.startsWith,
              length: json.length
            }
          })
      })
  }

  handleSave = (e) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.state.inputName }),
      credentials: 'include'
    };

    fetch(
      "http://localhost:3003/changeProfile", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        this.setState(
          {
            name: this.state.inputName,
            details: {
              startsWith: json.startsWith,
              length: json.length
            }
          })
      })
  };
}

export default App;
