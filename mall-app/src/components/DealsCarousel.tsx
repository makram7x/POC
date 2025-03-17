import React from "react";
import { deals } from "../data/dealsData";

interface DealsCarouselProps {
  animationsReady: boolean;
}

const DealsCarousel: React.FC<DealsCarouselProps> = ({ animationsReady }) => {
  return (
    <div className="mt-8">
      <div
        className={`relative w-full delayed-animation ${
          animationsReady ? "animate" : ""
        }`}
        style={{ transitionDelay: "1800ms" }}
      >
        <div className="flex items-center">
          <div
            id="deals-container"
            className="flex overflow-x-auto scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              width: "100%",
            }}
          >
            {deals.map((deal, index) => (
              <div
                key={index}
                className={`flex-none w-[300px] h-[150px] bg-white/10 backdrop-blur-sm rounded-xl mx-1 overflow-hidden scroll-snap-align-start delayed-animation ${
                  animationsReady ? "animate" : ""
                }`}
                style={{
                  transitionDelay: `${2000 + index * 100}ms`,
                  scrollSnapAlign: "start",
                }}
              >
                <div className="flex h-full">
                  <div className="w-1/2 h-full bg-white">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-1/2 p-4 flex flex-col justify-center items-center text-white">
                    <h3 className="text-sm font-bold mb-2">{deal.title}</h3>
                    <p className="text-xl font-bold text-orange-500">
                      {deal.sale}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsCarousel;
