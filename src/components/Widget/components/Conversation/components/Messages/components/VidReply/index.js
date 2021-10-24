import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class VidReply extends PureComponent {
    render() {
        return (
            <div className="rw-video">
                <b className="rw-video-title">{this.props.message.get('title')}</b>
                <div className="rw-video-details">
                    <div className="rw-videoFrame">
                        <img
                            src={require('./vid_logo.png')}
                            alt="time capsule logo"
                            className="video-logo"
                        />
                        <video
                            autoPlay="autoplay"
                            width="100%"
                            className="video-element"
                            playsinline
                        >
                            <source src={this.props.message.get('video')} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        );
    }
}

VidReply.propTypes = {
    message: PROP_TYPES.VIDREPLY,
};

export default VidReply;
