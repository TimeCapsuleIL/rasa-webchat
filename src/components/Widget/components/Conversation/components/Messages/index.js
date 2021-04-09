import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { MESSAGES_TYPES } from 'constants';
import { Video, Image, Message, Carousel, Buttons } from 'messagesComponents';

import './styles.scss';
import ThemeContext from '../../../../ThemeContext';

import Sender from '../Sender';
import displayMsgIndex from '../../../../../../store/reducers/displayMsgIndex';

const isToday = date => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const formatDate = date => {
    const dateToFormat = new Date(date);
    const showDate = isToday(dateToFormat) ? '' : `${dateToFormat.toLocaleDateString()} `;
    return `${showDate}${dateToFormat.toLocaleTimeString('en-US', { timeStyle: 'short' })}`;
};

const scrollToBottom = () => {
    const messagesDiv = document.getElementById('rw-messages');
    if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
};

class Messages extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // scrollToBottom();
        console.log('messages component didMount', this.props.displayMsgIndex);
    }

    componentDidUpdate() {
        // scrollToBottom();
        console.log('messages component didUpdate', this.props.displayMsgIndex);
    }

    getComponentToRender = (message, index, isLast) => {
        const { params } = this.props;
        const ComponentToRender = (() => {
            switch (message.get('type')) {
                case MESSAGES_TYPES.TEXT: {
                    return Message;
                }
                case MESSAGES_TYPES.CAROUSEL: {
                    return Carousel;
                }
                case MESSAGES_TYPES.VIDREPLY.VIDEO: {
                    return Video;
                }
                case MESSAGES_TYPES.IMGREPLY.IMAGE: {
                    return Image;
                }
                case MESSAGES_TYPES.BUTTONS: {
                    return Buttons;
                }
                case MESSAGES_TYPES.CUSTOM_COMPONENT:
                    return connect(
                        store => ({ store }),
                        dispatch => ({ dispatch })
                    )(this.props.customComponent);
                default:
                    return null;
            }
        })();
        if (message.get('type') === 'component') {
            return <ComponentToRender id={index} {...message.get('props')} isLast={isLast} />;
        }
        return <ComponentToRender id={index} params={params} message={message} isLast={isLast} />;
    };

    render() {
        const { displayTypingIndication, profileAvatar } = this.props;

        const renderMessages = () => {
            const { messages, showMessageDate } = this.props;

            if (messages.isEmpty()) return null;

            const groups = [];
            let group = null;

            const dateRenderer =
                typeof showMessageDate === 'function'
                    ? showMessageDate
                    : showMessageDate === true
                    ? formatDate
                    : null;

            const renderMessageDate = message => {
                const timestamp = message.get('timestamp');

                if (!dateRenderer || !timestamp) return null;
                const dateToRender = dateRenderer(message.get('timestamp', message));
                return dateToRender ? (
                    <span className="rw-message-date">
                        {dateRenderer(message.get('timestamp'), message)}
                    </span>
                ) : null;
            };

            const renderMessage = (message, index) => (
                <div className={`rw-message ${profileAvatar && 'rw-with-avatar'}`} key={index}>
                    {profileAvatar && message.get('showAvatar') && (
                        <img src={profileAvatar} className="rw-avatar" alt="profile" />
                    )}
                    {this.getComponentToRender(message, index, index === messages.size - 1)}
                    {renderMessageDate(message)}
                </div>
            );

            messages.forEach((msg, index) => {
                if (msg.get('hidden')) return;
                if (group === null || group.from !== msg.get('sender')) {
                    if (group !== null) groups.push(group);

                    group = {
                        from: msg.get('sender'),
                        messages: [],
                    };
                }

                group.messages.push(renderMessage(msg, index));
            });

            groups.push(group); // finally push last group of messages.

            let lastMessage = [groups.pop()];
            groups.forEach(item => {
                console.log('item', item);
                item.messages.forEach(message => {
                    console.log('message', message);
                });
            });
            // let displayMessage = displayMsgIndex
            //     ? groups.filter(
            //           (item => console.log('item', item),
            //           item.messages.filter(
            //               message => (
            //                   console.log('message', message),
            //                   message.get('video') && message.get('video' === displayMsgIndex)
            //               )
            //           ))
            //       )
            //     : [groups.pop()];

            return lastMessage.map((g, index) => (
                <div className={`rw-group-message rw-from-${g && g.from}`} key={`group_${index}`}>
                    {g.messages}
                </div>
                // return lastMessage.map((g, index) => (
                //     <div className={`rw-group-message rw-from-${g && g.from}`} key={`group_${index}`}>
                //         {g.messages}
                //     </div>
            ));
        };

        const { conversationBackgroundColor, assistBackgoundColor } = this.context;

        return (
            <>
                <div
                    id="rw-messages"
                    style={{ backgroundColor: conversationBackgroundColor }}
                    className="rw-messages-container"
                >
                    {!displayTypingIndication && renderMessages()}

                    <div className="circle-loader-wrapper">
                        <div className="left-element-loader">
                            {displayTypingIndication && <div className="circle-loader"></div>}
                            {displayTypingIndication && (
                                <img src={require('./loader_logo.png')} alt="time capsule logo" />
                            )}
                        </div>
                        <div className="right-element-loader"></div>
                    </div>
                </div>
                {/* <Sender
                    sendMessage={this.props.sendMessage}
                    disabledInput={this.props.disabledInput}
                    messages={this.props.messages}
                /> */}
            </>
        );
    }
}
Messages.contextType = ThemeContext;
Messages.propTypes = {
    messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
    displayMsgIndex: PropTypes.string,
    profileAvatar: PropTypes.string,
    customComponent: PropTypes.func,
    showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    displayTypingIndication: PropTypes.bool,
    changeDisplayMsgIndex: PropTypes.func,
};

Message.defaultTypes = {
    displayTypingIndication: false,
};

export default connect(store => ({
    messages: store.messages,
    displayMsgIndex: store.displayMsgIndex,
    displayTypingIndication: store.behavior.get('messageDelayed'),
}))(Messages);
