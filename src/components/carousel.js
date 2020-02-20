import React, { useReducer, useEffect } from 'react';

import './carousel.scss';

const initialCarouselState = {
  offset: 0,
  desired: 0,
  active: 0,
};

function next(length, current) {
  console.log('function next');
  return (current + 1) % length;
}

function carouselReducer(state, action) {
  switch(action.type) {
  case 'next':
    return {
      ...state,
      desired: next(action.length, state.active)
    };
  default:
    return state;
  }
}

function useCarousel(length, interval) {
  const[state, dispatch] = useReducer(carouselReducer, initialCarouselState);

  const transitionTime = 400;
  const elastic = `transform ${transitionTime}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
  const smooth = `transform ${transitionTime}ms ease`;

  const style = {
    transform: 'translateY(0)',
    width: `${100 * (length + 2)}%`
  };
  
  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'next', length }), interval);
    return () => clearTimeout(id);
  }, [state.active]);
  
  if(state.desire !== state.active) {
    const dist = Math.abs(state.active - state.desired);
    const pref = Math.sign(state.offset || 0);
    const dir = (dist > length / 2 ? 1 : -1) * Math.sign(state.desired - state.active);
    const shift = (100 * (pref || dir)) / (length + 2);
    
    style.transition = smooth;
    style.transform = `translateY(${shift}%)`;
  } else if(!isNaN(state.offset)) {
    if(state.offset !== 0) {
      style.transform = `translateY(${state.offset}px)`;
    } else {
      style.transition = elastic;
    }
  }
  
  return style;
}

const Carousel = ({ slides, interval = 1000 }) => {
  const length = slides.length;
  const style = useCarousel(length, interval);
  
  return (
    length > 0 && (
      <div className="carousel">
        <div className="carousel-content" style={style}>
          <div className="carousel-item">{slides[slides.length - 1]}</div>
          {slides.map((slide, index) => (
            <div className="carousel-item" key={index}>
              {slide}
            </div>
          ))}
          <div className="carousel-item">{slides[0]}</div>
        </div>
      </div>
    )
  );
};

export default Carousel;