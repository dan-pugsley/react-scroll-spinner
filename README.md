# react-scroll-spinner

Make HTML elements spin in response to scrolling. Spinning slows down with friction. Works with vertical and horizontal scrolling on any element. [Live example](https://pugs.ly/).

![ezgif com-gif-maker](https://user-images.githubusercontent.com/14273589/207964523-d8586dd9-7495-4028-97df-d0076b51a236.gif)

### Installation
```
npm i @dan-pugsley/react-scroll-spinner
```

### Example usage
```JSX
import useScrollSpinner from '@dan-pugsley/react-scroll-spinner';

export default function App() {
  const { spinnerRef, setSpinnerScroll } = useScrollSpinner();
  return (
    <main onScroll={e => setSpinnerScroll(e.target.scrollTop)}>
      {/* ... page content ... */}
      <div ref={spinnerRef}>Spinning element</div>
      {/* ... page content ... */}
    </main>
  );
}
```

### Options
Additional options can be specified:
```JSX
const { spinnerRef, setSpinnerScroll } = useScrollSpinner({
  speed: 0.6,
  friction: 0.00023,
  maxAngularVelocity: 0.0135,
});
```
