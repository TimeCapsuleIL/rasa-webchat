import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import {
    addUserMessage,
    emitUserMessage,
    setButtons,
    toggleInputDisabled,
    changeInputFieldHint,
} from 'actions';
import Message from '../Message/index';

import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';

class Buttons extends PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        this.state = { language: 'HE' };

        const { message, getChosenReply, inputState, id } = this.props;

        const hint = message.get('hint');
        const chosenReply = getChosenReply(id);
        if (!chosenReply && !inputState) {
            // this.props.toggleInputDisabled();
            // this.props.changeInputFieldHint(hint);
        }
    }

    componentDidMount() {
        if (this.props.customData.resourcesID.includes('lang-EN')) {
            this.setState({ language: 'EN' });
        } else {
            this.setState({ language: 'HE' });
        }
    }

    handleClick(reply, message) {
        const { chooseReply, id } = this.props;

        const payload = reply.get('payload');
        const title = reply.get('title');
        chooseReply(payload, title, id);
        this.props.changeDisplayMsgIndex(message.get('video'));
        // this.props.changeInputFieldHint('Type a message...');
    }

    renderButtons(message, buttons, persit) {
        const { isLast, linkTarget } = this.props;
        const { mainColor } = this.context;

        return (
            <div>
                {message.get('text') !== 'null' && <Message message={message} />}
                {(isLast || persit) && (
                    <div className="rw-replies">
                        {this.state.language === 'HE' && (
                            <div className="reply-prompt">אולי יעניין אותר גם על:</div>
                        )}
                        {this.state.language === 'EN' && (
                            <div className="reply-prompt">You also may be interested in:</div>
                        )}
                        {buttons.map((reply, index) => {
                            if (reply.get('type') === 'web_url') {
                                return (
                                    <a
                                        key={index}
                                        href={reply.get('url')}
                                        target={linkTarget || '_blank'}
                                        rel="noopener noreferrer"
                                        className={'rw-reply'}
                                        style={{ borderColor: mainColor, color: mainColor }}
                                        onMouseUp={e => e.stopPropagation()}
                                    >
                                        {reply.get('title')}
                                    </a>
                                );
                            }
                            return (
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <div
                                    key={index}
                                    className={'rw-reply'}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.handleClick(reply, message);
                                    }}
                                    style={{ borderColor: mainColor, color: mainColor }}
                                    onMouseUp={e => e.stopPropagation()}
                                >
                                    {reply.get('title')}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    render() {
        const { message, getChosenReply, id } = this.props;
        const chosenReply = getChosenReply(id);
        if (message.get('quick_replies') !== undefined) {
            const buttons = message.get('quick_replies');
            // if (chosenReply) {
            //   return (message.get("text") !== "null" ? <Message message={message} /> : null);
            // }
            return this.renderButtons(message, buttons, true);
        } else if (message.get('buttons') !== undefined) {
            const buttons = message.get('buttons');
            return this.renderButtons(message, buttons, true);
        }
        return <Message message={message} />;
    }
}

Buttons.contextType = ThemeContext;

const mapStateToProps = state => ({
    getChosenReply: id => state.messages.get(id).get('chosenReply'),
    inputState: state.behavior.get('disabledInput'),
    linkTarget: state.metadata.get('linkTarget'),
});

const mapDispatchToProps = dispatch => ({
    toggleInputDisabled: () => dispatch(toggleInputDisabled()),
    changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
    chooseReply: (payload, title, id) => {
        dispatch(setButtons(id, title));
        dispatch(addUserMessage(title));
        dispatch(emitUserMessage(payload));
        // dispatch(toggleInputDisabled());
    },
});

Buttons.propTypes = {
    getChosenReply: PropTypes.func,
    chooseReply: PropTypes.func,
    id: PropTypes.number,
    isLast: PropTypes.bool,
    message: PROP_TYPES.BUTTONS,
    linkTarget: PropTypes.string,
    changeDisplayMsgIndex: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
