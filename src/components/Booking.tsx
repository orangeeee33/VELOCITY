import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import "../styles/booking.css";

type PaymentMethod =
  | ""
  | "Cash"
  | "Wish Money";

type BookingForm = {
  car: string;
  location: string;
  pickupDate: string;
  returnDate: string;
  fullName: string;
  phone: string;
  paymentMethod:
    PaymentMethod;
};

const carOptions = [
  "BMW M5",
  "MERCEDES CLS 63",
  "BMW M4",
  "MERCEDES-AMG GT",
  "PORSCHE 911",
  "LAMBORGHINI HURACÁN",
  "MERCEDES-AMG G63",
  "RANGE ROVER SPORT SV",
];

const locations = [
  "Beirut",
  "Beirut Airport",
  "Jounieh",
  "Byblos",
  "Tripoli",
];

function Booking() {
  const today = useMemo(() => {
    const date = new Date();

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const [form, setForm] =
    useState<BookingForm>({
      car: "",
      location: "",
      pickupDate: "",
      returnDate: "",
      fullName: "",
      phone: "",
      paymentMethod: "",
    });

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "error" | "success" | ""
  >("");

  const updateField = <
    Field extends keyof BookingForm
  >(
    field: Field,
    value: BookingForm[Field]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setMessageType("");
  };

  useEffect(() => {
    const selectCar = (
      event: Event
    ) => {
      const carEvent =
        event as CustomEvent<string>;

      setForm((current) => ({
        ...current,
        car: carEvent.detail,
      }));

      setMessage("");
      setMessageType("");
    };

    window.addEventListener(
      "velocity-select-car",
      selectCar
    );

    return () => {
      window.removeEventListener(
        "velocity-select-car",
        selectCar
      );
    };
  }, []);

  const submitBooking = (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.car ||
      !form.location ||
      !form.pickupDate ||
      !form.returnDate ||
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.paymentMethod
    ) {
      setMessage(
        "Please complete all booking details."
      );

      setMessageType("error");

      return;
    }

    if (
      form.returnDate <
      form.pickupDate
    ) {
      setMessage(
        "Return date must be after the pick-up date."
      );

      setMessageType("error");

      return;
    }

    const whatsappNumber =
      import.meta.env
        .VITE_WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      setMessage(
        "WhatsApp number is not configured."
      );

      setMessageType("error");

      return;
    }

    const bookingMessage = [
      "Hello VELOCITY,",
      "",
      "I would like to request a car booking.",
      "",
      `Car: ${form.car}`,
      `Pick-up location: ${form.location}`,
      `Pick-up date: ${form.pickupDate}`,
      `Return date: ${form.returnDate}`,
      `Full name: ${form.fullName}`,
      `Phone number: ${form.phone}`,
      `Payment method: ${form.paymentMethod}`,
      "",
      "I understand that the main driver must be over 30 years old.",
      "",
      "I will attach clear photos of:",
      "- Valid ID, passport or residency",
      "- Valid driving licence",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        bookingMessage
      )}`;

    const whatsappWindow =
      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

    if (whatsappWindow) {
      setMessage(
        "WhatsApp opened. Send the prepared message and attach your document photos."
      );

      setMessageType("success");
    } else {
      setMessage(
        "Please allow pop-ups to continue through WhatsApp."
      );

      setMessageType("error");
    }
  };

  return (
    <section
      id="booking"
      className="booking-section"
    >
      <div className="booking-background-glow booking-glow-left" />

      <div className="booking-background-glow booking-glow-right" />

      <form
        className="booking-card"
        onSubmit={submitBooking}
      >
        <div className="booking-car-image">
          <img
            src="/cars/car-headlight.png"
            alt="Velocity car headlights"
          />
        </div>

        <div className="booking-card-heading">
          <div>
            <p>
              BOOKING REQUEST
            </p>

            <h2>
              RESERVE YOUR CAR
            </h2>
          </div>
        </div>

        <div className="booking-fields">
          <label className="booking-field">
            <span>
              SELECT YOUR CAR
            </span>

            <select
              name="car"
              value={form.car}
              required
              onChange={(event) =>
                updateField(
                  "car",
                  event.target.value
                )
              }
            >
              <option value="">
                Select your car
              </option>

              {carOptions.map(
                (car) => (
                  <option
                    value={car}
                    key={car}
                  >
                    {car}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="booking-field">
            <span>
              PICK-UP LOCATION
            </span>

            <select
              name="location"
              value={form.location}
              required
              onChange={(event) =>
                updateField(
                  "location",
                  event.target.value
                )
              }
            >
              <option value="">
                Select pick-up location
              </option>

              {locations.map(
                (location) => (
                  <option
                    value={location}
                    key={location}
                  >
                    {location}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="booking-field">
            <span>
              PICK-UP DATE
            </span>

            <input
              name="pickupDate"
              type="date"
              min={today}
              value={form.pickupDate}
              required
              onChange={(event) =>
                updateField(
                  "pickupDate",
                  event.target.value
                )
              }
            />
          </label>

          <label className="booking-field">
            <span>
              RETURN DATE
            </span>

            <input
              name="returnDate"
              type="date"
              min={
                form.pickupDate ||
                today
              }
              value={form.returnDate}
              required
              onChange={(event) =>
                updateField(
                  "returnDate",
                  event.target.value
                )
              }
            />
          </label>

          <label className="booking-field">
            <span>FULL NAME</span>

            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={form.fullName}
              required
              onChange={(event) =>
                updateField(
                  "fullName",
                  event.target.value
                )
              }
            />
          </label>

          <label className="booking-field">
            <span>
              PHONE NUMBER
            </span>

            <input
              name="phone"
              type="tel"
              placeholder="+961"
              autoComplete="tel"
              value={form.phone}
              required
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
            />
          </label>

          <fieldset className="payment-field">
            <legend>
              PAYMENT METHOD
            </legend>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  form.paymentMethod ===
                  "Cash"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash"
                  checked={
                    form.paymentMethod ===
                    "Cash"
                  }
                  required
                  onChange={() =>
                    updateField(
                      "paymentMethod",
                      "Cash"
                    )
                  }
                />

                <span className="payment-check" />

                <div>
                  <strong>CASH</strong>

                  <small>
                    Pay when confirmed
                  </small>
                </div>
              </label>

              <label
                className={`payment-option ${
                  form.paymentMethod ===
                  "Wish Money"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Wish Money"
                  checked={
                    form.paymentMethod ===
                    "Wish Money"
                  }
                  required
                  onChange={() =>
                    updateField(
                      "paymentMethod",
                      "Wish Money"
                    )
                  }
                />

                <span className="payment-check" />

                <div>
                  <strong>
                    WISH MONEY
                  </strong>

                  <small>
                    Digital payment
                  </small>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {message && (
          <p
            className={`booking-message ${messageType}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="booking-submit"
        >
          <span>
            CONTINUE ON WHATSAPP
          </span>
        </button>
      </form>
    </section>
  );
}

export default Booking;