import React from 'react';
import { Buffer } from 'buffer';

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            feedbacksList: []
        };
    }

    render() {
        return (
            <div>
                <div>Admin</div>
                <div>
                    {this.getContent()}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.fetchFeedback();
        this.fetchAuthorization();
    }

    fetchFeedback() {
        const requestOptions = {
            method: 'GET',
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/feedbacks", requestOptions)
            .then((res) => res.json())
            .then((json) => {
                this.setState(
                    {
                        feedbacksList: json.map(x => Buffer.from(x, 'base64').toString())
                    })
            });
    }

    fetchAuthorization() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/isAdmin", requestOptions)
            .then((res) => {
                this.setState(
                    {
                        isAdmin: res.status === 200
                    })
            });
    }

    getContent() {
        return (this.state.isAdmin
            ? (<p><h3>Feedbacks:</h3>{this.getFeedbacks()}</p>)
            : (<p><h3>Unauthorized</h3></p>));
    }

    getFeedbacks() {
        var feedbacks = []
        for (var fString of this.state.feedbacksList) {
            var f = eval("(" + fString + ")");

            feedbacks.push(<div><div>{f.who} @ {f.time}</div><div>{f.body}</div></div>);
        }
        return (feedbacks);
    }
}

export default Admin;
