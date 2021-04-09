import { List, fromJS } from 'immutable';
import { MESSAGE_SENDER, SESSION_NAME } from 'constants';

import {
    createButtons,
    createNewMessage,
    createCarousel,
    createVideoSnippet,
    createImageSnippet,
    createComponentMessage,
    storeMessageTo,
    getLocalSession,
} from './helper';

import * as actionTypes from '../actions/actionTypes';

export default function() {
    //   const initialState = List([]);

    const initialState = {
        videoUrl: '',
    };

    return function reducer(state = initialState, action) {
        switch (action.type) {
            // Each change to the redux store's message list gets recorded to storage
            case actionTypes.CHANGE_DISPLAY_MSG_INDEX: {
                console.log('from displayMessageIndex', state);
                return {
                    videoUrl: action.text,
                };
            }
            //   case actionTypes.ADD_NEW_RESPONSE_MESSAGE: {
            //     return storeMessage(state.push(createNewMessage(action.text, MESSAGE_SENDER.RESPONSE)));
            //   }

            default:
                return state;
        }
    };
}
