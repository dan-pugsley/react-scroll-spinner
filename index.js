import { useEffect, useRef } from 'react';

const defaultOptions = {
  speed: 0.6,
  friction: 0.00023,
  maxAngularVelocity: 0.0135,
};

const useAnimate = function(callback) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const animate = function(time) {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  useEffect(function() {
    requestRef.current = requestAnimationFrame(animate);
    return function() {
      cancelAnimationFrame(requestRef.current)
    };
  }, []); // Make sure the effect runs only once
};

const useScrollSpinner = function(options) {
  options = Object.assign(defaultOptions, options);
  const spinner = useRef(null);
  const spinnerAngle = useRef(0);
  const spinnerAngVel = useRef(0);
  const scroll = useRef(0);
  const prevScroll = useRef(0);
  useAnimate(function(deltaTime) {
    if (!spinner.current) {
      return;
    }
    // Calculate scroll change
    const deltaScroll = scroll.current - prevScroll.current;

    // Convert to angle change, velocity and direction
    const radius = 0.5 * spinner.current.clientWidth;
    const deltaAngle = options.speed * deltaScroll / radius;
    const angularVel = deltaAngle / deltaTime;
    const angularDir = Math.sign(angularVel);

    // If the calculated angular velocity if faster than current,
    // or in opposite direction, modify current to match.
    if (angularDir !== 0 && (angularDir !== Math.sign(spinnerAngVel.current) || Math.abs(angularVel) > Math.abs(spinnerAngVel.current))) {
      spinnerAngVel.current = angularVel;
    }

    // Apply friction
    if (spinnerAngVel.current !== 0) {
      const currentAngularDir = Math.sign(spinnerAngVel.current);
      spinnerAngVel.current -= currentAngularDir * options.friction * Math.sqrt(Math.abs(spinnerAngVel.current)) * deltaTime;

      // If angular direction has changed due to friction, clamp to 0.
      if (Math.sign(spinnerAngVel.current) !== currentAngularDir) {
        spinnerAngVel.current = 0;
      }
    }

    // Apply max limit to angular velocity
    spinnerAngVel.current = clamp(spinnerAngVel.current, -options.maxAngularVelocity, options.maxAngularVelocity);

    // Apply angular velocity
    spinnerAngle.current -= spinnerAngVel.current * deltaTime;
    spinner.current.style.transform = `rotate(${rad2deg(spinnerAngle.current)}deg)`;
    prevScroll.current = scroll.current;
  });
  return {
    spinnerRef: spinner,
    setSpinnerScroll: function(value) {
      scroll.current = value;
    },
  };
};

const clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

const rad2deg = function(value) {
  return value * 180 / Math.PI;
};

export default useScrollSpinner;
