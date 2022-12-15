import { useEffect, useRef } from 'react';

type Options = {
  speed?: number,
  friction?: number,
  maxAngularVelocity?: number,
}

const defaultOptions: Options = {
  speed: 0.6,
  friction: 0.00023,
  maxAngularVelocity: 0.0135,
};

const useAnimate = (callback: (deltaTime: number) => void) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
};

const useScrollSpinner = (options: Options) => {
  options = Object.assign(defaultOptions, options);
  const spinner = useRef<HTMLElement>(null);
  const spinnerAngle = useRef(0);
  const spinnerAngVel = useRef(0);
  const scroll = useRef(0);
  const prevScroll = useRef(0);
  useAnimate((deltaTime) => {
    if (!spinner.current) {
      return;
    }
    // Calculate scroll change
    const deltaScroll = scroll.current - prevScroll.current;

    // Convert to angle change, velocity and direction
    const radius = 0.5 * spinner.current.clientWidth;
    const deltaAngle = (options.speed ?? 0) * deltaScroll / radius;
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
      spinnerAngVel.current -= currentAngularDir * (options.friction ?? 0) * Math.sqrt(Math.abs(spinnerAngVel.current)) * deltaTime;

      // If angular direction has changed due to friction, clamp to 0.
      if (Math.sign(spinnerAngVel.current) !== currentAngularDir) {
        spinnerAngVel.current = 0;
      }
    }

    // Apply max limit to angular velocity
    spinnerAngVel.current = clamp(spinnerAngVel.current, -(options.maxAngularVelocity ?? 0), options.maxAngularVelocity ?? 0);

    // Apply angular velocity
    spinnerAngle.current -= spinnerAngVel.current * deltaTime;
    spinner.current.style.transform = `rotate(${rad2deg(spinnerAngle.current)}deg)`;
    prevScroll.current = scroll.current;
  });
  return {
    spinnerRef: spinner,
    setSpinnerScroll: (value: number) => {
      scroll.current = value;
    },
  };
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const rad2deg = (value: number) => {
  return value * 180 / Math.PI;
};

export default useScrollSpinner;
