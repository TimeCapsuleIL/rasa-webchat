import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';
import { Player } from 'video-react';

import './styles.scss';

import "node_modules/video-react/dist/video-react.css";

class VidReply extends PureComponent {
  render() {
    return (
      <div className="rw-video">
        <b className="rw-video-title">
          { this.props.message.get('title') }
        </b>
        <div className="rw-video-details">
          <Player
            playsInline
            autoPlay
            poster="/assets/poster.png"
            src={this.props.message.get('video')}
          />    
        </div>
      </div>
    );
  }
}

VidReply.propTypes = {
  message: PROP_TYPES.VIDREPLY
};

export default VidReply;
