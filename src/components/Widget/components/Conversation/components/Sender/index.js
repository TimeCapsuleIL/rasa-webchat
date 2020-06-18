import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import SpeechRecognition from "react-speech-recognition";
import Send from 'assets/send_button';
import Mic from 'assets/mic_button';
import './style.scss';

class Sender extends React.Component {
    
  constructor(props) {
      super(props);
      
      this.state = {inputValue: ""};
      this.formRef = React.createRef();
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onEnterPress = this.onEnterPress.bind(this);
  }
  
  handleChange(e) {
    this.setState({inputValue: e.target.value});
  }

  handleSubmit(e) {
    this.props.sendMessage(e);
    this.setState({inputValue: ""});
  }


  onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      // by dispatching the event we trigger onSubmit
      // formRef.current.submit() would not trigger onSubmit
      this.formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }
  
  render() {
      if ((this.props.browserSupportsSpeechRecognition && !this.state.inputValue && !this.props.transcript) || this.props.listening) {
        this.props.recognition.lang = "he-IL";
        
        return (
            <form ref={this.formRef} className="rw-sender" onSubmit={this.handleSubmit}>
                <TextareaAutosize type="text" minRows={1} onKeyDown={this.onEnterPress} maxRows={3} onChange={this.handleChange} className="rw-new-message" name="message" placeholder={this.props.inputTextFieldHint} disabled={this.props.transcript} autoFocus autoComplete="off" value={this.props.transcript} />
                <button type="button" className="rw-mic" onClick={this.props.listening ? this.props.stopListening : this.props.startListening}>
                    <Mic className="rw-mic-icon" listening={this.props.listening} alt="send" />
                </button>
            </form>
        );
      }
      else
      { 
        if (this.props.transcript) {
            if(!this.state.inputValue) {
                this.setState({inputValue: transcript});
            } else {
                this.props.resetTranscript();
            }
        }
        return (
            this.props.userInput === 'hide' ? <div /> : (
              <form ref={this.formRef} className="rw-sender" onSubmit={this.handleSubmit}>

                <TextareaAutosize type="text" minRows={1} onKeyDown={this.onEnterPress} maxRows={3} onChange={this.handleChange} className="rw-new-message" name="message" value={this.state.inputValue} placeholder={this.props.inputTextFieldHint} disabled={this.props.disabledInput || this.props.userInput === 'disable'} autoFocus autoComplete="off" />
                <button type="submit" className="rw-send" disabled={!(this.state.inputValue && this.state.inputValue.length > 0)}>
                  <Send className="rw-send-icon" ready={!!(this.state.inputValue && this.state.inputValue.length > 0)} alt="send" />
                </button>
              </form>)
        );
      }      
  }
}

const mapStateToProps = state => ({
  inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
  userInput: state.metadata.get('userInput')
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
  resetTranscript: PropTypes.func
};

const options = {
  autoStart: false,
  continuous: false
};

export default SpeechRecognition(options)(connect(mapStateToProps)(Sender));
