"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center mt-40 mb-50">
      <div className="loading-content">
        <div className="liquid"></div>
        <div className="liquid"></div>
        <div className="liquid"></div>
        <div className="liquid"></div>
      </div>
      <svg className="svg">
        <filter id="gooey">
          <feGaussianBlur stdDeviation="10" in="SourceGraphic"></feGaussianBlur>
          <feColorMatrix
            values={
              "1 0 0 0 0\n        0 1 0 0 0\n        0 0 1 0 0\n        0 0 0 20 -10"
            }
          ></feColorMatrix>
        </filter>
      </svg>
    </div>
  );
}
