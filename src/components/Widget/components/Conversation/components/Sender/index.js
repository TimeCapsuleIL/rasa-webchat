import React, { useState, useRef } from 'react';
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
        // console.log(this.props.messages);
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
        this.handleClick = this.handleClick.bind(this);
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

    componentDidMount() {
        // scrollToBottom();
        this.props.messages.map((message) => {
            console.log(message.get('video'));
        });
    }

    componentDidUpdate() {
        // scrollToBottom();
        this.props.messages.map((message) => {
            console.log(message.get('video'));
        });
    }

    handleShowSearchHistory() {
        this.setState({ showSearchHistory: !this.state.showSearchHistory });
    }

    handleClick(e) {
        e.stopPropagation();
        let selectedIndex = this.props.messages.map((item) => {
            console.log('item', item.get('video'));
            item.get('video') === e.target.id;
            if (item.get('video') === e.target.id) {
                return item;
            }
        });
        console.log('selectedIndex', selectedIndex);

        // let selectedItem = this.props.messages.splice(selectedIndex);
        // this.props.messages.unshift(selectedItem[0]);
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
                            {/* http://video.timecapsule.ai/1e73f341519043d721f93669ded35ed4/preferences.music.mp4 */}
                            {
                                // this.state.showSearchHistory &&
                                //     this.props.messages.map((message) => {
                                //         <div className="rw-video">
                                //             <div className="rw-video-details">
                                //                 <div className="rw-videoFrame">
                                //                     <div className="video-element">
                                //                         <div>{message.get('video')}</div>
                                //                     </div>
                                //                 </div>
                                //             </div>
                                //         </div>;
                                //     })

                                this.state.showSearchHistory && (
                                    <div className="search-history-wrapper">
                                        {this.props.messages.map((message) => {
                                            if (message.get('video')) {
                                                let lastSlash = message
                                                    .get('video')
                                                    .lastIndexOf('/');
                                                let title = message
                                                    .get('video')
                                                    .slice(lastSlash)
                                                    .replace('.mp4', '')
                                                    .replace(/_/g, ' ')
                                                    .replace('/', '')
                                                    .replace('.', ': ');

                                                return (
                                                    <div
                                                        id={message.get('video')}
                                                        className="search-history-item"
                                                        onClick={(e) => this.handleClick(e)}
                                                    >
                                                        {title}
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                )
                            }
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

const mapStateToProps = (state) => ({
    messages: state.messages,
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
