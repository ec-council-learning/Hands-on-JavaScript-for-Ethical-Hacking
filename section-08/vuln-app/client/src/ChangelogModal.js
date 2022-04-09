import React from 'react';
import Popup from 'reactjs-popup';
import parse from 'html-react-parser';
import 'reactjs-popup/dist/index.css';

class ChangelogModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changelogList: [],
    };
  }

  render() {
    return (
      <Popup trigger={<a>Changelog</a>} modal>
        {this.getChanges()}
      </Popup>
    )
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: `<?xml version="1.0"?>
          <Versions>
            <Version>1.0</Version>
            <Version>1.1</Version>
            <Version>1.2</Version>
            <Version>1.3</Version>
            <Version>1.4</Version>
          </Versions>`
    };

    fetch(
      "http://localhost:3003/changelog", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        this.setState(
          {
            changelogList: json
          })
      })
  }

  getChanges() {
    var changelist = []
    for(var change of this.state.changelogList){
      changelist.push(<div>{parse(change)}</div>);
    }
    return (changelist);
  }
}

export default ChangelogModal;
