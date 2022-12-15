"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const defaultOptions = {
    speed: 0.6,
    friction: 0.00023,
    maxAngularVelocity: 0.0135,
};
const useAnimate = (callback) => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = (0, react_1.useRef)(0);
    const previousTimeRef = (0, react_1.useRef)(0);
    const animate = (time) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };
    (0, react_1.useEffect)(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once
};
const useScrollSpinner = (options) => {
    options = Object.assign(defaultOptions, options);
    const spinner = (0, react_1.useRef)(null);
    const spinnerAngle = (0, react_1.useRef)(0);
    const spinnerAngVel = (0, react_1.useRef)(0);
    const scroll = (0, react_1.useRef)(0);
    const prevScroll = (0, react_1.useRef)(0);
    useAnimate((deltaTime) => {
        var _a, _b, _c, _d;
        if (!spinner.current) {
            return;
        }
        // Calculate scroll change
        const deltaScroll = scroll.current - prevScroll.current;
        // Convert to angle change, velocity and direction
        const radius = 0.5 * spinner.current.clientWidth;
        const deltaAngle = ((_a = options.speed) !== null && _a !== void 0 ? _a : 0) * deltaScroll / radius;
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
            spinnerAngVel.current -= currentAngularDir * ((_b = options.friction) !== null && _b !== void 0 ? _b : 0) * Math.sqrt(Math.abs(spinnerAngVel.current)) * deltaTime;
            // If angular direction has changed due to friction, clamp to 0.
            if (Math.sign(spinnerAngVel.current) !== currentAngularDir) {
                spinnerAngVel.current = 0;
            }
        }
        // Apply max limit to angular velocity
        spinnerAngVel.current = clamp(spinnerAngVel.current, -((_c = options.maxAngularVelocity) !== null && _c !== void 0 ? _c : 0), (_d = options.maxAngularVelocity) !== null && _d !== void 0 ? _d : 0);
        // Apply angular velocity
        spinnerAngle.current -= spinnerAngVel.current * deltaTime;
        spinner.current.style.transform = `rotate(${rad2deg(spinnerAngle.current)}deg)`;
        prevScroll.current = scroll.current;
    });
    return {
        spinnerRef: spinner,
        setSpinnerScroll: (value) => {
            scroll.current = value;
        },
    };
};
const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};
const rad2deg = (value) => {
    return value * 180 / Math.PI;
};
exports.default = useScrollSpinner;
