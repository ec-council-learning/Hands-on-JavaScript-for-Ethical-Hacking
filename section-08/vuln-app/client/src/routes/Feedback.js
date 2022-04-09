import React from 'react';
import { Buffer } from 'buffer';

class Feedback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fName: "",
            fComment: ""
        };
    }

    render() {
        return (
            <div>
                <h3>Feedback</h3>
                <div>
                    <input id="name" value={this.state.fName} onChange={e => this.updateInputName(e)} placeholder="Your name"></input>
                    <input id="comment" value={this.state.fComment} onChange={e => this.updateInputComment(e)} placeholder="Comment"></input>
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            </div>
        );
    }

    updateInputName = (e) => {
        this.setState({
            fName: e.target.value
        });
    };

    updateInputComment = (e) => {
        this.setState({
            fComment: e.target.value.replace(/[\{\}]+/g, "")
        });
    };

    handleSubmit = (e) => {
        var feedback = JSON.stringify({ who: this.state.fName, body: this.state.fComment, time: new Date().toISOString().substring(0, 10) });
        var encoded = Buffer.from(feedback).toString('base64');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: encoded }),
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/newFeedback", requestOptions)
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        fComment: ''
                    });
                    this.setState({
                        fName: ''
                    });
                }
            });
    }
};

export default Feedback;
