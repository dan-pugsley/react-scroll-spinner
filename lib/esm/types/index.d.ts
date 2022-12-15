/// <reference types="react" />
type Options = {
    speed?: number;
    friction?: number;
    maxAngularVelocity?: number;
};
declare const useScrollSpinner: (options: Options) => {
    spinnerRef: import("react").RefObject<HTMLElement>;
    setSpinnerScroll: (value: number) => void;
};
export default useScrollSpinner;
//# sourceMappingURL=index.d.ts.map