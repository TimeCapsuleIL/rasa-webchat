import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ThemeContext from '../src/components/Widget/ThemeContext';

function Mic({ listening }) {
  const { mainColor } = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      enableBackground="new 0 0 535.5 535.5"
      version="1.1"
      viewBox="0 0 535.5 535.5"
      xmlSpace="preserve"
    >
      <path
        className={listening ? 'rw-mic-icon-stop' : 'rw-mic-icon'}
        style={{ fill: listening ? : mainColor}}
        d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"
      />
    </svg>
  );
}


Mic.propTypes = {
  listening: PropTypes.bool
};

export default Mic;
