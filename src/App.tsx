import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";
import "./styles/booking.css";

import OurCars from "./components/OurCars";
import Booking from "./components/Booking";
import HowItWorks from "./components/HowItWorks";

type Stage =
  | "opening"
  | "cinematic"
  | "rental"
  | "finished";

type VideoMode =
  | "idle"
  | "forward"
  | "reverse";

const START_TIME = 0.2;

function App() {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const reverseFrameRef =
    useRef<number | null>(null);

  const modeRef =
    useRef<VideoMode>("idle");

  const lockedRef =
    useRef(true);

  const collectionOpenedRef =
    useRef(false);

  const stageRef =
    useRef<Stage>("opening");

  const touchStartYRef =
    useRef(0);

  const [stage, setStage] =
    useState<Stage>("opening");

  const [
    collectionOpened,
    setCollectionOpened,
  ] = useState(false);

  const [
    menuOpened,
    setMenuOpened,
  ] = useState(false);

  const changeStage = (
    nextStage: Stage
  ) => {
    stageRef.current = nextStage;
    setStage(nextStage);
  };

  const lockPage = () => {
    lockedRef.current = true;

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";
  };

  const unlockPage = () => {
    lockedRef.current = false;

    document.documentElement.style.overflow =
      "";

    document.body.style.overflow =
      "";
  };

  const updateStage = (
    currentTime: number,
    duration: number
  ) => {
    if (
      !duration ||
      !Number.isFinite(duration)
    ) {
      return;
    }

    const progress =
      currentTime / duration;

    if (progress >= 0.985) {
      changeStage("finished");
    } else if (progress >= 0.58) {
      changeStage("rental");
    } else if (
      currentTime >
      START_TIME + 0.08
    ) {
      changeStage("cinematic");
    } else {
      changeStage("opening");
    }
  };

  const playForward = () => {
    const video = videoRef.current;

    if (
      !video ||
      modeRef.current !== "idle"
    ) {
      return;
    }

    if (
      stageRef.current === "finished"
    ) {
      return;
    }

    if (
      reverseFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        reverseFrameRef.current
      );

      reverseFrameRef.current = null;
    }

    modeRef.current = "forward";
    video.playbackRate = 1;

    video
      .play()
      .then(() => {
        changeStage("cinematic");
      })
      .catch(() => {
        modeRef.current = "idle";
        changeStage("opening");
      });
  };

  const playReverse = () => {
    const video = videoRef.current;

    if (
      !video ||
      modeRef.current !== "idle" ||
      video.currentTime <= START_TIME
    ) {
      return;
    }

    video.pause();
    modeRef.current = "reverse";

    let previousTime =
      performance.now();

    const reverseVideo = (
      animationTime: number
    ) => {
      const currentVideo =
        videoRef.current;

      if (!currentVideo) return;

      const elapsed =
        (animationTime -
          previousTime) /
        1000;

      previousTime =
        animationTime;

      const nextTime =
        currentVideo.currentTime -
        elapsed;

      if (
        nextTime <= START_TIME
      ) {
        currentVideo.currentTime =
          START_TIME;

        modeRef.current = "idle";

        reverseFrameRef.current =
          null;

        changeStage("opening");

        return;
      }

      currentVideo.currentTime =
        nextTime;

      updateStage(
        nextTime,
        currentVideo.duration
      );

      reverseFrameRef.current =
        requestAnimationFrame(
          reverseVideo
        );
    };

    reverseFrameRef.current =
      requestAnimationFrame(
        reverseVideo
      );
  };

  const openCollection = () => {
    if (
      stageRef.current !==
      "finished"
    ) {
      return;
    }

    collectionOpenedRef.current =
      true;

    setCollectionOpened(true);
    setMenuOpened(false);

    unlockPage();

    requestAnimationFrame(() => {
      document
        .getElementById("cars")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  const navigateTo = (
    sectionId: string
  ) => {
    setMenuOpened(false);

    if (
      !collectionOpenedRef.current
    ) {
      if (
        stageRef.current !==
        "finished"
      ) {
        playForward();
      }

      return;
    }

    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const returnToVideo = () => {
    setMenuOpened(false);

    if (
      !collectionOpenedRef.current
    ) {
      return;
    }

    collectionOpenedRef.current =
      false;

    setCollectionOpened(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      lockPage();
    }, 550);
  };

  useEffect(() => {
    if (
      "scrollRestoration" in
      window.history
    ) {
      window.history.scrollRestoration =
        "manual";
    }

    document.documentElement.style.scrollBehavior =
      "auto";

    window.scrollTo(0, 0);
    lockPage();

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);

      document.documentElement.style.scrollBehavior =
        "smooth";
    });

    const handleWheel = (
      event: WheelEvent
    ) => {
      if (
        !lockedRef.current &&
        window.scrollY <= 2 &&
        event.deltaY < 0
      ) {
        event.preventDefault();

        collectionOpenedRef.current =
          false;

        setCollectionOpened(false);
        setMenuOpened(false);

        lockPage();
        playReverse();

        return;
      }

      if (!lockedRef.current) {
        return;
      }

      event.preventDefault();

      if (
        event.deltaY > 0 &&
        modeRef.current === "idle"
      ) {
        playForward();
      }

      if (
        event.deltaY < 0 &&
        modeRef.current === "idle"
      ) {
        playReverse();
      }
    };

    const handleTouchStart = (
      event: TouchEvent
    ) => {
      touchStartYRef.current =
        event.touches[0].clientY;
    };

    const handleTouchMove = (
      event: TouchEvent
    ) => {
      if (lockedRef.current) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (
      event: TouchEvent
    ) => {
      const touchEndY =
        event.changedTouches[0]
          .clientY;

      const distance =
        touchStartYRef.current -
        touchEndY;

      if (
        lockedRef.current &&
        distance > 35 &&
        modeRef.current === "idle"
      ) {
        playForward();

        return;
      }

      if (
        lockedRef.current &&
        distance < -35 &&
        modeRef.current === "idle"
      ) {
        playReverse();

        return;
      }

      if (
        !lockedRef.current &&
        window.scrollY <= 2 &&
        distance < -35
      ) {
        collectionOpenedRef.current =
          false;

        setCollectionOpened(false);
        setMenuOpened(false);

        lockPage();
        playReverse();
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setMenuOpened(false);
      }

      if (!lockedRef.current) {
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        playForward();
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        playReverse();
      }
    };

    window.addEventListener(
      "wheel",
      handleWheel,
      { passive: false }
    );

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd,
      { passive: true }
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      if (
        reverseFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          reverseFrameRef.current
        );
      }

      window.removeEventListener(
        "wheel",
        handleWheel
      );

      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.documentElement.style.overflow =
        "";

      document.body.style.overflow =
        "";

      document.documentElement.style.scrollBehavior =
        "";
    };
  }, []);

  return (
    <main>
      <nav
        className={`navbar ${
          collectionOpened
            ? "navbar-light"
            : ""
        }`}
      >
        <button
          type="button"
          className="logo"
          onClick={returnToVideo}
        >
          VELOCITY
        </button>

        {collectionOpened && (
          <div className="desktop-navigation">
            <button
              type="button"
              onClick={() =>
                navigateTo("cars")
              }
            >
              OUR CARS
            </button>

            <button
              type="button"
              onClick={() =>
                navigateTo(
                  "how-it-works"
                )
              }
            >
              HOW IT WORKS
            </button>

            <button
              type="button"
              onClick={() =>
                navigateTo("contact")
              }
            >
              CONTACT
            </button>

            <button
              type="button"
              className="book-button"
              onClick={() =>
                navigateTo("booking")
              }
            >
              BOOK A CAR
            </button>
          </div>
        )}

        <button
          type="button"
          className={`menu-toggle ${
            menuOpened
              ? "menu-opened"
              : ""
          }`}
          aria-label={
            menuOpened
              ? "Close menu"
              : "Open menu"
          }
          onClick={() =>
            setMenuOpened(
              (current) => !current
            )
          }
        >
          <span />
          <span />
        </button>
      </nav>

      {menuOpened && (
        <div
          className={`navigation-menu ${
            collectionOpened
              ? "navigation-menu-light"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={() =>
              navigateTo("cars")
            }
          >
            <span>01</span>
            OUR CARS
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo(
                "how-it-works"
              )
            }
          >
            <span>02</span>
            HOW IT WORKS
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("contact")
            }
          >
            <span>03</span>
            CONTACT
          </button>

          <button
            type="button"
            className="mobile-book-button"
            onClick={() =>
              navigateTo("booking")
            }
          >
            BOOK A CAR
          </button>
        </div>
      )}

      <section
        id="hero"
        className="hero-scroll"
      >
        <div
          className="video-stage"
          onClick={() => {
            if (
              lockedRef.current &&
              modeRef.current ===
                "idle" &&
                stageRef.current !==
                "finished"
            ) {
              playForward();
            }
          }}
        >
          <video
            ref={videoRef}
            className="car-video"
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => {
              const video =
                videoRef.current;

              if (!video) return;
              if (
                modeRef.current ===
                "idle"
              ) {
                video.pause();

                if (
                  video.currentTime <
                  START_TIME
                ) {
                  video.currentTime =
                    START_TIME;
                }

                changeStage(
                  "opening"
                );
              }
            }}
            onTimeUpdate={() => {
              const video =
                videoRef.current;

              if (!video) return;

              updateStage(
                video.currentTime,
                video.duration
              );
            }}
            onEnded={() => {
              modeRef.current =
                "idle";

              changeStage("finished");
            }}
          >
            <source
              src={`${import.meta.env.BASE_URL}videos/2session-mobile.mp4`}
              type="video/mp4"
            />
          </video>

          <div className="video-overlay" />

          <div
            className={`intro-copy ${
              stage === "opening"
                ? "show"
                : ""
            }`}
          >
            <p>
              PREMIUM CAR RENTAL
            </p>

            <h1>
              DRIVE YOUR
              <br />
              <span>MOMENT.</span>
            </h1>

            <small>
              Luxury cars.
              Unforgettable journeys.
            </small>
          </div>

          <div
            className={`checkpoint rental-checkpoint ${
              stage === "rental"
                ? "show"
                : ""
            }`}
          >
            <p>
              PREMIUM CAR RENTAL
            </p>

            <h2>
              RENT THE RIDE.
              <br />

              <span>
                OWN THE MOMENT.
              </span>
            </h2>
          </div>

          <div
            className={`checkpoint final-checkpoint ${
              stage === "finished"
                ? "show"
                : ""
            }`}
          >
            <p>
              YOUR JOURNEY STARTS
              HERE
            </p>

            <h2>
              READY TO
              <br />
              <span>DRIVE?</span>
            </h2>

            <button
              type="button"
              onClick={openCollection}
            >
              EXPLORE OUR CARS
              <b>↗</b>
            </button>
          </div>

          <div
            className={`scroll-indicator ${
              stage === "opening"
                ? "show-indicator"
                : ""
            }`}
          >
            <span />
          </div>
        </div>
      </section>

      <OurCars />
      <HowItWorks />
      <Booking />

      <footer id="contact">
        <span>VELOCITY</span>

        <div>
          <a href="tel:+96100000000">
            +961 00 000 000
          </a>

          <a href="mailto:R@velocity.com">
            R@velocity.com
          </a>
        </div>

        <p>© 2026 VELOCITY</p>
      </footer>
    </main>
  );
}

export default App;