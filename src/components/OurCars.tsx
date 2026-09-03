import {
  useEffect,
  useState,
} from "react";

import "../styles/ourCars.css";

type Car = {
  id: number;
  name: string;
  category: string;
  price: number;
  engine: string;
  power: string;
  seats: number;
  transmission: string;
  color: string;
  images: string[];
};

const cars: Car[] = [
  {
    id: 1,
    name: "BMW M5",
    category: "PERFORMANCE SEDAN",
    price: 450,
    engine: "4.4L V8",
    power: "617 HP",
    seats: 5,
    transmission: "AUTOMATIC",
    color: "GRAPHITE GREY",
    images: [
      "/cars/BMW-M5/front.png",
      "/cars/BMW-M5/side.png",
      "/cars/BMW-M5/rear.png",
      "/cars/BMW-M5/interior.png",
    ],
  },
  {
    id: 2,
    name: "MERCEDES CLS 63",
    category: "LUXURY COUPÉ",
    price: 380,
    engine: "4.0L V8",
    power: "603 HP",
    seats: 5,
    transmission: "AUTOMATIC",
    color: "OBSIDIAN GREY",
    images: [
      "/cars/Mercedes-CLS63/front.png",
      "/cars/Mercedes-CLS63/side.png",
      "/cars/Mercedes-CLS63/rear.png",
      "/cars/Mercedes-CLS63/interior.png",
    ],
  },
  {
    id: 3,
    name: "BMW M4",
    category: "SPORT COUPÉ",
    price: 350,
    engine: "3.0L I6",
    power: "503 HP",
    seats: 4,
    transmission: "AUTOMATIC",
    color: "ISLE OF MAN GREEN",
    images: [
      "/cars/BMW-M4/front.png",
      "/cars/BMW-M4/side.png",
      "/cars/BMW-M4/rear.png",
      "/cars/BMW-M4/interior.png",
    ],
  },
  {
    id: 4,
    name: "MERCEDES-AMG GT",
    category: "GRAND TOURER",
    price: 550,
    engine: "4.0L V8",
    power: "577 HP",
    seats: 2,
    transmission: "AUTOMATIC",
    color: "PATAGONIA RED",
    images: [
      "/cars/Mercedes-AMG-GT/front.png",
      "/cars/Mercedes-AMG-GT/side.png",
      "/cars/Mercedes-AMG-GT/rear.png",
      "/cars/Mercedes-AMG-GT/interior.png",
    ],
  },
  {
    id: 5,
    name: "PORSCHE 911",
    category: "SPORTS CAR",
    price: 600,
    engine: "3.0L FLAT-6",
    power: "443 HP",
    seats: 4,
    transmission: "AUTOMATIC",
    color: "GT SILVER",
    images: [
      "/cars/Porsche-911/front.png",
      "/cars/Porsche-911/side.png",
      "/cars/Porsche-911/rear.png",
      "/cars/Porsche-911/interior.png",
    ],
  },
  {
    id: 6,
    name: "LAMBORGHINI HURACÁN",
    category: "SUPERCAR",
    price: 1200,
    engine: "5.2L V10",
    power: "631 HP",
    seats: 2,
    transmission: "AUTOMATIC",
    color: "GIALLO INTI",
    images: [
      "/cars/Lamborghini-Huracan-EVO/front.png",
      "/cars/Lamborghini-Huracan-EVO/side.png",
      "/cars/Lamborghini-Huracan-EVO/rear.png",
      "/cars/Lamborghini-Huracan-EVO/interior.png",
    ],
  },
  {
    id: 7,
    name: "MERCEDES-AMG G63",
    category: "LUXURY SUV",
    price: 750,
    engine: "4.0L V8",
    power: "577 HP",
    seats: 5,
    transmission: "AUTOMATIC",
    color: "OBSIDIAN BLACK",
    images: [
      "/cars/Mercedes-AMG-G63/front.png",
      "/cars/Mercedes-AMG-G63/side.png",
      "/cars/Mercedes-AMG-G63/rear.png",
      "/cars/Mercedes-AMG-G63/interior.png",
    ],
  },
  {
    id: 8,
    name: "RANGE ROVER SPORT SV",
    category: "PERFORMANCE SUV",
    price: 650,
    engine: "4.4L V8",
    power: "626 HP",
    seats: 5,
    transmission: "AUTOMATIC",
    color: "PEARL WHITE",
    images: [
      "/cars/Range-Rover-Sport-SV/front.png",
      "/cars/Range-Rover-Sport-SV/side.png",
      "/cars/Range-Rover-Sport-SV/rear.png",
      "/cars/Range-Rover-Sport-SV/interior.png",
    ],
  },
];

function OurCars() {
  const [
    selectedCar,
    setSelectedCar,
  ] = useState<Car | null>(null);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const openCar = (car: Car) => {
    setSelectedCar(car);
    setSelectedImage(0);
  };

  const closeCar = () => {
    setSelectedCar(null);
    setSelectedImage(0);
  };

  const changeImage = (
    direction: number
  ) => {
    if (!selectedCar) return;

    setSelectedImage(
      (current) =>
        (
          current +
          direction +
          selectedCar.images.length
        ) % selectedCar.images.length
    );
  };
const goToRequirements = () => {
  if (!selectedCar) return;

  window.dispatchEvent(
    new CustomEvent(
      "velocity-select-car",
      {
        detail:
          selectedCar.name,
      }
    )
  );

  closeCar();

  window.setTimeout(() => {
    document
      .getElementById(
        "requirements"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 100);
};

  useEffect(() => {
    if (!selectedCar) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedCar(null);
        setSelectedImage(0);
      }

      if (
        event.key === "ArrowRight"
      ) {
        setSelectedImage(
          (current) =>
            (
              current +
              1 +
              selectedCar.images.length
            ) %
            selectedCar.images.length
        );
      }

      if (
        event.key === "ArrowLeft"
      ) {
        setSelectedImage(
          (current) =>
            (
              current -
              1 +
              selectedCar.images.length
            ) %
            selectedCar.images.length
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedCar]);

  return (
    <>
      <section
        id="cars"
        className="cars-section"
      >
        <div className="cars-heading">
          <div>
            <p className="section-label">
              VELOCITY FLEET
            </p>

            <h2>
              FIND YOUR
              <br />

              <span>
                PERFECT RIDE.
              </span>
            </h2>
          </div>

          <p className="cars-introduction">
            Performance, luxury and
            unforgettable machines.
          </p>
        </div>

        <div className="cars-grid">
          {cars.map(
            (car, index) => (
              <button
                type="button"
                className="car-card"
                key={car.id}
                onClick={() =>
                  openCar(car)
                }
              >
                <div className="car-image-box">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                  />

                  <span className="car-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="view-car">
                    VIEW CAR
                    <b>↗</b>
                  </span>
                </div>

                <div className="car-card-content">
                  <p>
                    {car.category}
                  </p>

                  <h3>
                    {car.name}
                  </h3>

                  <div className="car-card-bottom">
                    <span>
                      FROM
                    </span>

                    <strong>
                      ${car.price}

                      <small>
                        / DAY
                      </small>
                    </strong>
                  </div>
                </div>
              </button>
            )
          )}
        </div>
      </section>

      {selectedCar && (
        <div
          className="car-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCar();
            }
          }}
        >
          <article className="car-modal">
            <button
              type="button"
              className="close-car-modal"
              aria-label="Close car"
              onClick={closeCar}
            >
              <span />
              <span />
            </button>

            <div className="modal-gallery">
              <img
                src={
                  selectedCar.images[
                    selectedImage
                  ]
                }
                alt={`${selectedCar.name} ${
                  selectedImage + 1
                }`}
              />

              <span className="modal-car-category">
                {
                  selectedCar.category
                }
              </span>

              <div className="modal-gallery-controls">
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    changeImage(-1)
                  }
                >
                  ←
                </button>

                <span>
                  {String(
                    selectedImage + 1
                  ).padStart(2, "0")}

                  <i>/</i>

                  {String(
                    selectedCar.images
                      .length
                  ).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() =>
                    changeImage(1)
                  }
                >
                  →
                </button>
              </div>
            </div>

            <div className="modal-thumbnails">
              {selectedCar.images.map(
                (image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={
                      selectedImage ===
                      index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                  >
                    <img
                      src={image}
                      alt={`${selectedCar.name} thumbnail`}
                    />
                  </button>
                )
              )}
            </div>

            <div className="modal-information">
              <div className="modal-title">
                <div>
                  <p>
                    SELECTED VEHICLE
                  </p>

                  <h3>
                    {selectedCar.name}
                  </h3>
                </div>

                <div className="modal-price">
                  <strong>
                    $
                    {
                      selectedCar.price
                    }
                  </strong>

                  <span>
                    PER DAY
                  </span>
                </div>
              </div>

              <div className="modal-specifications">
                <div>
                  <span>ENGINE</span>

                  <strong>
                    {
                      selectedCar.engine
                    }
                  </strong>
                </div>

                <div>
                  <span>POWER</span>

                  <strong>
                    {
                      selectedCar.power
                    }
                  </strong>
                </div>

                <div>
                  <span>SEATS</span>

                  <strong>
                    {
                      selectedCar.seats
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    TRANSMISSION
                  </span>

                  <strong>
                    {
                      selectedCar.transmission
                    }
                  </strong>
                </div>

                <div>
                  <span>COLOR</span>

                  <strong>
                    {
                      selectedCar.color
                    }
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="modal-book-button"
                onClick={goToRequirements}
              >
                <span>
                 WHAT YOU NEED
                </span>

                <b>↗</b>
              </button>
            </div>
          </article>
        </div>
      )}
    </>
  );
}

export default OurCars;