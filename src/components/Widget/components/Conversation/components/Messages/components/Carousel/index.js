import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addUserMessage, emitUserMessage } from 'actions';
import { PROP_TYPES } from 'constants';

import './styles.scss';

const Carousel = (props) => {
  const carousel = props.message.toJS();

  const handleClick = (action) => {
    if (!action || action.type !== 'postback') return;
    const { chooseReply } = props;
    chooseReply(action.payload, action.title);
  };

  const scrollContainer = useRef();
  const [leftButton, setLeftButton] = useState(false);
  const [rightButton, setRightButton] = useState(true);

  const handleScroll = () => {
    const current = scrollContainer.current;
    if (scrollContainer.current.scrollLeft > 0) {
      setLeftButton(true);
    } else {
      setLeftButton(false);
    }
    if (current.clientWidth === current.scrollWidth - current.scrollLeft) {
      setRightButton(false);
    } else {
      setRightButton(true);
    }
  };

  const handleLeftArrow = () => {
    scrollContainer.current.scrollTo({
      left: scrollContainer.current.scrollLeft - 230,
      behavior: 'smooth'
    });
  };

  const handleRightArrow = () => {
    scrollContainer.current.scrollTo({
      left: scrollContainer.current.scrollLeft + 230,
      behavior: 'smooth'
    });
  };

  return (
    <React.Fragment>
      <div className="rw-carousel-container" ref={scrollContainer} onScroll={() => handleScroll()}>
        {carousel.elements.map((carouselCard, index) => {
          const defaultActionUrl =
            carouselCard.default_action && carouselCard.default_action.type === 'web_url'
              ? carouselCard.default_action.url
              : null;
          return (
            <div className="rw-carousel-card" key={index}>
              <a
                href={defaultActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(carouselCard.default_action)}
              >
                {carouselCard.image_url ? (
                  <img
                    className="rw-carousel-card-image"
                    src={carouselCard.image_url}
                    alt={`${carouselCard.title} ${carouselCard.subtitle}}}`}
                  />
                ) : (
                  <div className="rw-carousel-card-image" />
                )}
              </a>
              <a
                className="rw-carousel-card-title"
                href={defaultActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(carouselCard.default_action)}
              >
                {carouselCard.title}
              </a>
              <a
                className="rw-carousel-card-subtitle"
                href={defaultActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(carouselCard.default_action)}
              >
                {carouselCard.subtitle}
              </a>
              <div className="rw-carousel-buttons-container">
                {carouselCard.buttons.map((button, buttonIndex) => {
                  if (button.type === 'web_url') {
                    return (
                      <a
                        key={buttonIndex}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rw-reply"
                      >
                        <span>{button.title}</span>
                      </a>
                    );
                  }
                  return (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      key={buttonIndex}
                      className="rw-reply"
                      onClick={() => handleClick(button)}
                      role="button"
                      tabIndex={0}
                    >
                      <span>{button.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rw-carousel-arrows-container">
        {leftButton && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="rw-left-arrow rw-carousel-arrow"
            onClick={handleLeftArrow}
            role="button"
            tabIndex={0}
          />
        )}
        {rightButton && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="rw-right-arrow rw-carousel-arrow"
            onClick={handleRightArrow}
            role="button"
            tabIndex={0}
          />
        )}
      </div>
    </React.Fragment>
  );
};

Carousel.propTypes = {
  message: PROP_TYPES.CAROUSEL,
  // completely bugged, it's actually used in handle click
  // eslint-disable-next-line react/no-unused-prop-types
  chooseReply: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  chooseReply: (payload, title) => {
    if (title) dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
  }
});

export default connect(() => ({}), mapDispatchToProps)(Carousel);
