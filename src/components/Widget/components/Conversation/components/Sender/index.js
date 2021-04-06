import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-textarea-autosize';
import SpeechRecognition from 'react-speech-recognition';
import Send from 'assets/send_button';
import Mic from 'assets/mic_button';
import SearchHistory from '../SearchHistory';
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
        this.setMessage = this.setMessage.bind(this);
    }

    handleChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    setMessage() {
        this.props.setSelectedMessage = this.setSelectedMessage.bind(this);
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
                                    <SearchHistory
                                        profileAvatar={this.props.profileAvatar}
                                        params={this.props.params}
                                        customComponent={this.props.customComponent}
                                        showMessageDate={this.props.showMessageDate}
                                        selectedMessage={this.props.selectedMessage}
                                        setSelectedMessage={this.props.setMessage}
                                    />
                                    {/* {this.state.searchHistory.map(item => {
                                        return <div className="search-history-item">{item}</div>;
                                    })} */}
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

const mapStateToProps = state => ({
    inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
    userInput: state.metadata.get('userInput'),
});

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
};

const options = {
    autoStart: false,
    continuous: false,
};

export default SpeechRecognition(options)(connect(mapStateToProps)(Sender));
