# react-scroll-spinner

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
