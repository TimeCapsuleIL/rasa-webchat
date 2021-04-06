import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import SpeechRecognition from 'react-speech-recognition';
import Send from 'assets/send_button';
import Mic from 'assets/mic_button';
import './style.scss';

class Sender extends React.Component {
    constructor(props) {
        super(props);

        this.state = { inputValue: '' };
        this.state = { showSearchHistory: '' };
        this.state = {
            searchHistory: [
                'יציק קליין',
                'צבי גרוס',
                'יציק קליין',
                'צבי גרוס',
                'יציק קליין',
                'צבי גרוס',
                'יציק קליין',
                'צבי גרוס',
                'יציק קליין',
                'צבי גרוס',
            ],
        };
        this.formRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.handleShowSearchHistory = this.handleShowSearchHistory.bind(this);
    }

    handleChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    handleSubmit(e) {
        this.props.sendMessage(e);
        this.setState({ inputValue: '' });
    }

    onEnterPress(e) {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            // by dispatching the event we trigger onSubmit
            // formRef.current.submit() would not trigger onSubmit
            this.formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }

    handleShowSearchHistory() {
        this.setState({ showSearchHistory: !this.state.showSearchHistory });
    }

    render() {
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

            return groups.map(
                (g, index) => console.log('sender', g.messages)
                // <div className={`rw-group-message rw-from-${g && g.from}`} key={`group_${index}`}>
                //     {g.messages}
                // </div>
            );
        };

        if (
            (this.props.browserSupportsSpeechRecognition &&
                !this.state.inputValue &&
                !this.props.transcript) ||
            this.props.listening
        ) {
            this.props.recognition.lang = 'he-IL';

            return (
                <div className="widget-form-wrapper">
                    <div className="form-left-element">
                        <button
                            onClick={this.handleShowSearchHistory}
                            className="search-history-button"
                        >
                            שאלות קודמות
                        </button>
                        <div className="input-form-wrapper">
                            <form
                                ref={this.formRef}
                                className="rw-sender"
                                onSubmit={this.handleSubmit}
                            >
                                <TextareaAutosize
                                    type="text"
                                    minRows={1}
                                    onKeyDown={this.onEnterPress}
                                    maxRows={3}
                                    onChange={this.handleChange}
                                    className="rw-new-message"
                                    name="message"
                                    placeholder={this.props.inputTextFieldHint}
                                    disabled={this.props.transcript}
                                    autoFocus
                                    autoComplete="off"
                                    value={this.props.transcript}
                                />
                                <button
                                    type="button"
                                    className="rw-mic"
                                    onClick={
                                        this.props.listening
                                            ? this.props.stopListening
                                            : this.props.startListening
                                    }
                                >
                                    <Mic
                                        className="rw-mic-icon"
                                        listening={this.props.listening}
                                        alt="send"
                                    />
                                </button>
                            </form>
                            {this.state.showSearchHistory && (
                                <div className="search-history-wrapper">
                                    {/* {this.state.searchHistory.map(item => {
                                        return <div className="search-history-item">{item}</div>;
                                    })} */}
                                    {renderMessages()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-right-element"></div>
                </div>
            );
        } else {
            if (this.props.transcript) {
                if (!this.state.inputValue) {
                    this.setState({ inputValue: this.props.transcript });
                } else {
                    this.props.resetTranscript();
                }
            }
            return this.props.userInput === 'hide' ? (
                <div />
            ) : (
                <div className="widget-form-wrapper">
                    <div className="form-left-element">
                        <button
                            onClick={this.handleShowSearchHistory}
                            className="search-history-button"
                        >
                            שאלות קודמות
                        </button>
                        <div className="input-form-wrapper">
                            <form
                                ref={this.formRef}
                                className="rw-sender"
                                onSubmit={this.handleSubmit}
                            >
                                <TextareaAutosize
                                    type="text"
                                    minRows={1}
                                    onKeyDown={this.onEnterPress}
                                    maxRows={3}
                                    onChange={this.handleChange}
                                    className="rw-new-message"
                                    name="message"
                                    value={this.state.inputValue}
                                    placeholder={this.props.inputTextFieldHint}
                                    disabled={
                                        this.props.disabledInput ||
                                        this.props.userInput === 'disable'
                                    }
                                    autoFocus
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="rw-send"
                                    disabled={
                                        !(this.state.inputValue && this.state.inputValue.length > 0)
                                    }
                                >
                                    <Send
                                        className="rw-send-icon"
                                        ready={
                                            !!(
                                                this.state.inputValue &&
                                                this.state.inputValue.length > 0
                                            )
                                        }
                                        alt="send"
                                    />
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="form-right-element"></div>
                </div>
            );
        }
    }
}

// const mapStateToProps = state => ({
//     inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
//     userInput: state.metadata.get('userInput'),
// });

Sender.propTypes = {
    sendMessage: PropTypes.func,
    inputTextFieldHint: PropTypes.string,
    disabledInput: PropTypes.bool,
    userInput: PropTypes.string,
    transcript: PropTypes.string,
    browserSupportsSpeechRecognition: PropTypes.bool,
    listening: PropTypes.bool,
    recognition: PropTypes.object,
    startListening: PropTypes.func,
    stopListening: PropTypes.func,
    resetTranscript: PropTypes.func,

    messages: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
    profileAvatar: PropTypes.string,
    customComponent: PropTypes.func,
    showMessageDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    displayTypingIndication: PropTypes.bool,
};

// export default connect(store => ({
//     messages: store.messages,
// }))(Sender);

const options = {
    autoStart: false,
    continuous: false,
};

// export default SpeechRecognition(options)(connect(mapStateToProps)(Sender));
export default SpeechRecognition(options)(
    connect(
        state => ({
            inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
            userInput: state.metadata.get('userInput'),
        }),
        store => ({
            messages: store.messages,
        })
    )(Sender)
);
