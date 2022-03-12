import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class ChangelogModal extends React.Component {
    render() {
        return (
            <Popup trigger={<a>Changelog</a>} modal>
                <span></span>
            </Popup>
        )
    }
}

export default ChangelogModal;
