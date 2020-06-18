import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import SpeechRecognition from "react-speech-recognition";
import Send from 'assets/send_button';
import Mic from 'assets/mic_button';
import './style.scss';

const Sender = ({ sendMessage, inputTextFieldHint, disabledInput, userInput, transcript, browserSupportsSpeechRecognition, listening, recognition, startListening, stopListening }) => {
  const [inputValue, setInputValue] = useState('');
  const formRef = useRef('');
  
  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    sendMessage(e);
    setInputValue('');
  }


  function onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      // by dispatching the event we trigger onSubmit
      // formRef.current.submit() would not trigger onSubmit
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }
  
  if (browserSupportsSpeechRecognition && !inputValue || listening) {
    recognition.lang = "he-IL";
    
    return (
        <form ref={formRef} className="rw-sender" onSubmit={handleSubmit}>
            <TextareaAutosize type="text" minRows={1} onKeyDown={onEnterPress} maxRows={3} className="rw-new-message" name="message" placeholder={inputTextFieldHint} disabled={transcript} autoFocus autoComplete="off" value={transcript} />
            <button className="rw-mic" onClick={listening ? stopListening : startListening}>
                <Mic className="rw-mic-icon" listening={listening} alt="send" />
            </button>
        </form>
    );
  }
  
  return (
    userInput === 'hide' ? <div /> : (
      <form ref={formRef} className="rw-sender" onSubmit={handleSubmit}>

        <TextareaAutosize type="text" minRows={1} onKeyDown={onEnterPress} maxRows={3} onChange={handleChange} className="rw-new-message" name="message" placeholder={inputTextFieldHint} disabled={disabledInput || userInput === 'disable'} autoFocus autoComplete="off" />
        <button type="submit" className="rw-send" disabled={!(inputValue && inputValue.length > 0)}>
          <Send className="rw-send-icon" ready={!!(inputValue && inputValue.length > 0)} alt="send" />
        </button>
      </form>)
    );
};
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
  stopListening: PropTypes.func
};

const options = {
  autoStart: false,
  continous: false
};

export default SpeechRecognition(options)(connect(mapStateToProps)(Sender));
