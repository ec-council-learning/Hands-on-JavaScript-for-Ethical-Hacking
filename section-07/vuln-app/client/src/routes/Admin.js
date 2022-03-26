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
        this.setState(
            {
                feedbacksList: [
                    Buffer.from('{ time: "2022-32-22", who: "Not Friend", body: "Hackable" }').toString('base64'),
                    Buffer.from('{ time: "2022-03-24", who: "Author", body: "Good job, remember that git history is crucial when hunting for information disclosure! This time is just a comment from me - but outside of this course it can have credentials or other useful data!" }').toString("base64")
                ]
            });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/isAdmin", requestOptions)
            .then((res) => {
                console.log(res.status);
                this.setState(
                    {
                        isAdmin: res.status === 200
                    })
            })
    }

    getContent() {
        return (this.state.isAdmin
            ? (<p><h3>Feedbacks:</h3>{this.getFeedbacks()}</p>)
            : (<p><h3>Unauthorized</h3></p>));
    }

    getFeedbacks() {
        var feedbacks = []
        for (var fString of this.state.feedbacksList) {
            var f = eval("(" + Buffer.from(fString, 'base64') + ")");

            feedbacks.push(<div><div>{f.who} @ {f.time}</div><div>{f.body}</div></div>);
        }
        return (feedbacks);
    }
}

export default Admin;
