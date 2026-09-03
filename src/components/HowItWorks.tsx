import "../styles/howItWorks.css";

const steps = [
  {
    number: "01",
    title: "CHOOSE YOUR CAR",
    text: "Explore our fleet and choose the vehicle that matches your journey.",
  },
  {
    number: "02",
    title: "SEND YOUR REQUEST",
    text: "Select your dates, pick-up location and enter your contact details.",
  },
  {
    number: "03",
    title: "GET CONFIRMATION",
    text: "Our team confirms availability and contacts you through WhatsApp.",
  },
];

const requirements = [
  {
    number: "01",
    title: "VALID IDENTIFICATION",
    text: "A valid ID card, passport or Lebanese residency permit.",
  },
  {
    number: "02",
    title: "DRIVING LICENCE",
    text: "A valid driving licence must be presented before pick-up.",
  },
  {
    number: "03",
    title: "AGE REQUIREMENT",
    text: "The main driver must be over 30 years old.",
  },
  {
    number: "04",
    title: "DOCUMENT PHOTOS",
    text: "Clear photos of the required documents will be requested.",
  },
];

function HowItWorks() {
  const openBooking = () => {
    document
      .getElementById("booking")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section
      id="how-it-works"
      className="how-section"
    >
      <div className="how-heading">
        <p className="how-label">
          SIMPLE. FAST. SECURE.
        </p>

        <h2>
          HOW IT
          <br />

          <span>WORKS.</span>
        </h2>

        <p className="how-description">
          From choosing your vehicle
          to receiving confirmation,
          every step is designed to be
          simple.
        </p>
      </div>

      <div className="rental-steps">
        {steps.map((step) => (
          <article key={step.number}>
            <div className="step-number">
              {step.number}
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>
          </article>
        ))}
      </div>

      <div 
      id="requirements"
      className="requirements-section">
        <div className="requirements-heading">
          <div>
            <p>
              RENTAL REQUIREMENTS
            </p>

            <h3>
              WHAT YOU
              <span> NEED.</span>
            </h3>
          </div>

          <p className="requirements-description">
            Please make sure you meet
            the following requirements
            before submitting your
            booking request.
          </p>
        </div>

        <div className="requirements-grid">
          {requirements.map(
            (requirement) => (
              <article
                key={
                  requirement.number
                }
              >
                <div className="requirement-icon">
                  <span>
                    {
                      requirement.number
                    }
                  </span>
                </div>

                <div>
                  <h4>
                    {
                      requirement.title
                    }
                  </h4>

                  <p>
                    {
                      requirement.text
                    }
                  </p>
                </div>
              </article>
            )
          )}
        </div>

        <div className="documents-notice">
          <div className="notice-light" />

          <div>
            <span>
              DOCUMENT PRIVACY
            </span>

            <p>
              Document photos will
              only be requested
              through WhatsApp after
              confirming vehicle
              availability.
            </p>
          </div>

          <button
            type="button"
            onClick={openBooking}
          >
            CONTINUE TO BOOKING
            <b>↗</b>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;