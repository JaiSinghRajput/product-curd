// components/ImageCarousel.jsx
import { useState } from "react";

const ImageCarousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);

  const goTo = (index) => setCurrent(index);

  const next = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  const prev = () =>
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  if (!images.length) return null;

  return (
    <div className="relative">
      {/* Image */}
      <div className="bg-gray-100 rounded-xl p-4 flex justify-center items-center h-40">
        <img
          src={images[current]}
          className="h-full object-contain"
        />
      </div>

      {/* Left Arrow */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full px-2"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full px-2"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                current === i
                  ? "bg-orange-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;