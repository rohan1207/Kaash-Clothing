import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [scrollPhase, setScrollPhase] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(2); // Start with center model
  const [mobileScrolled, setMobileScrolled] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12,
  });
  const navigate = useNavigate();

  // Refs for GSAP animations
  const modelsRef = useRef([]);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileTopContentRef = useRef(null);
  const mobileBottomContentRef = useRef(null);
  const mobileModelRef = useRef(null);
  const mobileArrowsRef = useRef(null);

  // Model images data
  const models = [
    {
      id: 1,
      src: "/left_far.png",
      position: "left-far",
      collection: "Jeans",
      link: "jeans",
    },
    {
      id: 2,
      src: "/left_near.png",
      position: "left-near",
      collection: "Sarees",
      link: "saree",
    },
    {
      id: 3,
      src: "/center.png",
      position: "center",
      collection: "Kurtis",
      link: "kurti",
    },
    {
      id: 4,
      src: "/right_near.png",
      position: "right-near",
      collection: "Western Wear",
      link: "western",
    },
    {
      id: 5,
      src: "/right_far.png",
      position: "right-far",
      collection: "Tops",
      link: "top",
    },
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getImageStyles = (position) => {
    const positions = {
      "left-far": {
        left: "0%",
        height: "50vh",
        zIndex: 1,
        rotationY: 20,
        bottom: "40%",
      },
      "left-near": {
        left: "20%",
        height: "55vh",
        zIndex: 2,
        rotationY: 20,
        bottom: "25%",
      },
      center: {
        left: "50%",
        height: "60vh",
        zIndex: 3,
        rotationY: 0,
        bottom: "10%",
      },
      "right-near": {
        left: "63%",
        height: "55vh",
        zIndex: 2,
        rotationY: -20,
        bottom: "25%",
      },
      "right-far": {
        left: "75%",
        height: "50vh",
        zIndex: 1,
        rotationY: -20,
        bottom: "40%",
      },
    };

    return positions[position] || {};
  };

  // Mobile model navigation with improved transitions
  const navigateModel = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentModelIndex + 1) % models.length
        : (currentModelIndex - 1 + models.length) % models.length;

    // Fade out current model
    if (mobileModelRef.current) {
      mobileModelRef.current.style.opacity = "0";
      mobileModelRef.current.style.transition =
        "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Change model after fade out
      setTimeout(() => {
        setCurrentModelIndex(newIndex);

        // Fade in new model
        if (mobileModelRef.current) {
          mobileModelRef.current.style.opacity = "1";
          mobileModelRef.current.style.transition =
            "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        }
      }, 300);
    } else {
      setCurrentModelIndex(newIndex);
    }
  };

  // Mobile scroll/touch handler
  useEffect(() => {
    if (!isMobile) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let initialScrollHandled = false;
    const threshold = 50;

    // Initially prevent scrolling
    if (!initialScrollHandled) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.scrollBehavior = "smooth";
    }

    const handleTouchStart = (e) => {
      if (!initialScrollHandled) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (!initialScrollHandled) {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchStartY - touchY;
        const deltaX = Math.abs(touchStartX - touchX);

        // Only trigger vertical scroll if horizontal movement is minimal
        if (deltaX < threshold) {
          e.preventDefault();
          if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
              setMobileScrolled(true);
              initialScrollHandled = true;
              // Enable scrolling after animation completes
              setTimeout(() => {
                document.body.style.overflow = "auto";
                document.body.style.touchAction = "auto";
              }, 1500); // Match with total animation duration
            }
          }
        }
      }
    };

    const handleWheel = (e) => {
      if (!initialScrollHandled) {
        e.preventDefault();
        if (e.deltaY > 0) {
          setMobileScrolled(true);
          initialScrollHandled = true;
          // Enable scrolling after animation completes
          setTimeout(() => {
            document.body.style.overflow = "auto";
            document.body.style.touchAction = "auto";
          }, 1500); // Match with total animation duration
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      // Reset body styles on cleanup
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [isMobile]);

  // Desktop initialization (unchanged)
  useEffect(() => {
    if (isMobile) return;

    modelsRef.current.forEach((model, index) => {
      if (model) {
        const modelData = models[index];
        const isCenter = modelData.position === "center";

        // Use GSAP-like animations with CSS transitions
        if (model.style) {
          model.style.opacity = isCenter ? "1" : "0";
          model.style.transform =
            "translateX(-60%) scale(" + (isCenter ? 1 : 0.8) + ")";
          model.style.left = "50%";
          model.style.transition = "all 0.8s ease-out";
        }
      }
    });

    // Animate content elements
    setTimeout(() => {
      if (descriptionRef.current) {
        descriptionRef.current.style.opacity = "1";
        descriptionRef.current.style.transform = "translateY(0)";
      }
      if (buttonRef.current) {
        buttonRef.current.style.opacity = "1";
      }
      if (headingRef.current) {
        headingRef.current.style.opacity = "1";
        headingRef.current.style.transform = "translateY(0)";
      }
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = "1";
        scrollIndicatorRef.current.style.transform = "translateY(0)";
      }
    }, 500);
  }, [isMobile]);

  // Desktop scroll phase animations
  useEffect(() => {
    if (isMobile) return;

    if (scrollPhase === 1) {
      // Hide content
      if (contentRef.current) {
        contentRef.current.style.opacity = "0";
        contentRef.current.style.transition = "opacity 0.3s ease-out";
      }

      // Hide scroll indicator
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = "0";
        scrollIndicatorRef.current.style.transform = "translateY(50px)";
      }

      // Animate models to their positions
      modelsRef.current.forEach((model, index) => {
        if (model) {
          const modelData = models[index];
          const styles = getImageStyles(modelData.position);
          const isCenter = modelData.position === "center";

          setTimeout(
            () => {
              model.style.opacity = "1";
              model.style.transform = `translateX(${
                isCenter ? "-50%" : "0"
              }) scale(1) rotateY(${styles.rotationY || 0}deg)`;
              model.style.left = styles.left;
              model.style.transition = "all 1.2s ease-out";
            },
            isCenter ? 0 : modelData.position.includes("near") ? 150 : 300
          );
        }
      });

      setTimeout(() => {
        setInitialAnimationComplete(true);
      }, 1400);
    } else {
      // Show content
      if (contentRef.current) {
        contentRef.current.style.opacity = "1";
        contentRef.current.style.transition = "opacity 0.5s ease-out";
      }

      // Show scroll indicator
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = "1";
        scrollIndicatorRef.current.style.transform = "translateY(0)";
      }

      // Reset models to center
      modelsRef.current.forEach((model, index) => {
        if (model) {
          const modelData = models[index];
          const isCenter = modelData.position === "center";

          model.style.opacity = isCenter ? "1" : "0";
          model.style.transform = `translateX(-50%) scale(${
            isCenter ? 1 : 0.8
          })`;
          model.style.left = "50%";
          model.style.transition = "all 1.2s ease-out";
        }
      });

      setInitialAnimationComplete(false);
    }
  }, [scrollPhase, isMobile]);

  // Desktop scroll handler
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = (e) => {
      if (!initialAnimationComplete) {
        e.preventDefault();
        if (e.deltaY > 0 && scrollPhase === 0) {
          setScrollPhase(1);
          setShowContent(false);
        } else if (e.deltaY < 0 && scrollPhase === 1) {
          setScrollPhase(0);
          setShowContent(true);
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [scrollPhase, initialAnimationComplete, isMobile]);

  // Mobile animations
  useEffect(() => {
    if (!isMobile) return;

    if (mobileScrolled) {
      // Hide top content with smooth easing
      if (mobileTopContentRef.current) {
        mobileTopContentRef.current.style.opacity = "0";
        mobileTopContentRef.current.style.transform = "translateY(-20px)";
        mobileTopContentRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      // Hide bottom content with smooth easing
      if (mobileBottomContentRef.current) {
        mobileBottomContentRef.current.style.opacity = "0";
        mobileBottomContentRef.current.style.transform = "translateY(20px)";
        mobileBottomContentRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      // Scale up center model with smooth easing
      if (mobileModelRef.current) {
        mobileModelRef.current.style.transform = "scale(1.2)";
        mobileModelRef.current.style.transition =
          "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      // Show arrows with delayed fade in
      if (mobileArrowsRef.current) {
        mobileArrowsRef.current.style.opacity = "1";
        mobileArrowsRef.current.style.transform = "translateX(0)";
        mobileArrowsRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s";
      }
    } else {
      // Reset all elements when scrolling back
      if (mobileTopContentRef.current) {
        mobileTopContentRef.current.style.opacity = "1";
        mobileTopContentRef.current.style.transform = "translateY(0)";
        mobileTopContentRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      if (mobileBottomContentRef.current) {
        mobileBottomContentRef.current.style.opacity = "1";
        mobileBottomContentRef.current.style.transform = "translateY(0)";
        mobileBottomContentRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      if (mobileModelRef.current) {
        mobileModelRef.current.style.transform = "scale(1)";
        mobileModelRef.current.style.transition =
          "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
      }

      if (mobileArrowsRef.current) {
        mobileArrowsRef.current.style.opacity = "0";
        mobileArrowsRef.current.style.transform = "translateX(-10px)";
        mobileArrowsRef.current.style.transition =
          "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    }
  }, [mobileScrolled, isMobile]);

  // Hover handlers for desktop
  const handleModelClick = (link) => {
    if (!isMobile) {
      navigate(`/${link}`);
    }
  };

  const handleModelHover = (index, isHovering) => {
    if (isMobile) return;

    const model = modelsRef.current[index];
    const img = model?.querySelector("img");
    const label = model?.querySelector(".collection-label");

    if (img) {
      img.style.transform = `scale(${isHovering ? 1.03 : 1})`;
      img.style.transition = "transform 0.4s ease-out";
    }

    if (label) {
      label.style.transform = `translateY(${
        isHovering ? 0 : 20
      }px) translateX(-50%)`;
      label.style.opacity = isHovering ? "1" : "0";
      label.style.transition = "all 0.4s ease-out";
    }
  };

  const handleButtonHover = (isHovering) => {
    if (isMobile) return;

    if (buttonRef.current) {
      buttonRef.current.style.transform = `scale(${isHovering ? 1.05 : 1})`;
      buttonRef.current.style.backgroundColor = isHovering
        ? "black"
        : "transparent";
      buttonRef.current.style.color = isHovering ? "white" : "black";
      buttonRef.current.style.transition = "all 0.3s ease-out";
    }
  };

  // Mobile model click handler
  const handleMobileModelClick = () => {
    if (mobileScrolled) {
      navigate(`/${models[currentModelIndex].link}`);
    }
  };

  // Add timer effect
  useEffect(() => {
    if (!mobileScrolled) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1;
          if (newMinutes < 0) {
            const newHours = prev.hours - 1;
            if (newHours < 0) {
              return { hours: 23, minutes: 59, seconds: 59 };
            }
            return { hours: newHours, minutes: 59, seconds: 59 };
          }
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mobileScrolled]);

  if (isMobile) {
    return (
      <div className="relative w-full h-screen bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
          <h1 className="text-xl font-light tracking-widest text-center py-3">
            TSK
          </h1>
        </div>

        {/* Main Content Container - Improved spacing */}
        <div className="flex-1 flex flex-col items-center justify-between pt-4 pb-2">
          {/* Top Content - Reduced spacing */}
          <div
            ref={mobileTopContentRef}
            className="w-full text-center px-4 mb-2"
            style={{
              opacity: mobileScrolled ? 0 : 1,
              transform: mobileScrolled ? "translateY(-20px)" : "translateY(0)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <h1 className="text-xl sm:text-2xl font-light tracking-wide">
              CRAFTED TO
              <br />
              <span className="font-extralight">CRAFTED
TO <br></br> EMBRACE
ELEGANCE</span>
            </h1>
          </div>

          {/* Center Content with Models - Improved scaling and positioning */}
          <div className="relative w-full flex-1 flex items-start justify-center py-2 px-4">
            {/* Background Models - More faded and further apart */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute left-0 opacity-15"
                style={{
                  transform: `scale(0.45) translateX(-50px)`,
                  filter: "blur(3px)",
                  zIndex: 1,
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <img
                  src={
                    models[
                      (currentModelIndex - 1 + models.length) % models.length
                    ].src
                  }
                  alt="Left model"
                  className="h-72 w-auto object-cover"
                />
              </div>

              <div
                className="absolute right-0 opacity-15"
                style={{
                  transform: `scale(0.45) translateX(50px)`,
                  filter: "blur(3px)",
                  zIndex: 1,
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <img
                  src={models[(currentModelIndex + 1) % models.length].src}
                  alt="Right model"
                  className="h-72 w-auto object-cover"
                />
              </div>
            </div>

            {/* Main Model Container with improved spacing */}
            <div
              ref={mobileModelRef}
              className="relative z-10 flex flex-col items-center max-w-[85vw]"
              style={{
                transform: mobileScrolled ? "scale(1.02)" : "scale(1)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Category Tag - Better positioned above model */}
              <div
                className={`mb-3 text-center transition-all duration-500 ${
                  mobileScrolled
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-2"
                }`}
              >
                <span className="inline-block text-[10px] tracking-[0.3em] text-stone-500 uppercase">
                  Our Exclusive Collection
                </span>
                <h3 className="text-sm tracking-widest text-stone-800 mt-0.5">
                  {models[currentModelIndex].collection}
                </h3>
              </div>

              {/* Model Image with adjusted size */}
              <div className="relative">
                <img
                  src={models[currentModelIndex].src}
                  alt={`Model ${currentModelIndex + 1}`}
                  className="h-[50vh] w-auto object-cover"
                  style={{
                    maxHeight: "320px",
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onClick={handleMobileModelClick}
                />

                {/* Sale Content - Better positioned and spaced */}
                <div
                  className={`absolute -bottom-70 left-1/2 transform -translate-x-1/2 w-full max-w-[240px] text-center transition-all duration-500 ${
                    mobileScrolled
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className="inline-block text-[9px] tracking-[0.3em] text-stone-500 uppercase border-b border-stone-200 pb-0.5">
                    Exclusive Offer
                  </span>

                  <div className="mt-1.5">
                    <h2 className="text-3xl font-extralight text-stone-900 tracking-tight leading-none">
                      50<span className="text-xl align-top ml-0.5">%</span>
                    </h2>
                    <div className="text-[10px] tracking-widest text-stone-500 uppercase mt-0.5">
                      Season Sale
                    </div>
                  </div>

                  {/* Timer - More compact design */}
                  <div className="flex items-center justify-center gap-3 text-stone-400 text-[10px] tracking-wider my-1.5">
                    <div>
                      <span className="text-stone-900 font-light">
                        {String(remainingTime.hours).padStart(2, "0")}
                      </span>
                      <span className="ml-0.5 text-[9px]">HRS</span>
                    </div>
                    <div>
                      <span className="text-stone-900 font-light">
                        {String(remainingTime.minutes).padStart(2, "0")}
                      </span>
                      <span className="ml-0.5 text-[9px]">MIN</span>
                    </div>
                    <div>
                      <span className="text-stone-900 font-light">
                        {String(remainingTime.seconds).padStart(2, "0")}
                      </span>
                      <span className="ml-0.5 text-[9px]">SEC</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/${models[currentModelIndex].link}`)
                    }
                    className="text-[10px] tracking-[0.2em] uppercase py-1 px-3 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors duration-300"
                  >
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Content - Adjusted spacing */}
          <div
            ref={mobileBottomContentRef}
            className="w-full px-2 text-center mt-0 mb-10"
            style={{
              opacity: mobileScrolled ? 0 : 1,
              transform: mobileScrolled ? "translateY(10px)" : "translateY(0)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <p className="text-[11px] text-black/80 font-light leading-relaxed tracking-wide mb-10 max-w-[280px] mx-auto">
              Curated collection of luxurious fashion pieces designed to blend
              traditional charm with modern sophistication.
            </p>
            <button className="px-4 py-1.5 text-[10px] tracking-widest border border-black hover:bg-black hover:text-white transition-colors mb-5">
              EXPLORE COLLECTION
            </button>
          </div>
        </div>

        {/* Navigation Arrows - Smaller and better positioned */}
        <div
          ref={mobileArrowsRef}
          className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-40"
          style={{
            opacity: mobileScrolled ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <button
            onClick={() => navigateModel("prev")}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          <button
            onClick={() => navigateModel("next")}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden pointer-events-none">
      {/* Models Lineup */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {models.map((model, index) => (
          <div
            key={model.id}
            ref={(el) => (modelsRef.current[index] = el)}
            className="absolute px-1 md:px-2 lg:px-3 origin-bottom perspective-[1000px] bg-transparent pointer-events-auto"
            style={{
              ...getImageStyles(model.position),
              transform: "translateX(-50%)",
              opacity: 0,
              transition: "all 0.8s ease-out",
            }}
          >
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => handleModelHover(index, true)}
              onMouseLeave={() => handleModelHover(index, false)}
              onClick={() => handleModelClick(model.link)}
            >
              <img
                src={model.src}
                alt={`Model ${model.id}`}
                className="h-[190px] sm:h-[460px] w-auto object-cover bg-transparent relative"
                style={{ willChange: "transform" }}
              />
              <div
                className="collection-label absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-max cursor-pointer"
                style={{
                  opacity: 0,
                  transform: "translateY(20px) translateX(-50%)",
                  transition: "all 0.4s ease-out",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModelClick(model.link);
                }}
              >
                <span className="text-sm tracking-widest text-stone-600 whitespace-nowrap">
                  {model.collection}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="w-full h-full flex flex-col md:flex-row items-center justify-between px-5 md:px-15 pt-24 md:pt-0 md:mb-[300px] pointer-events-auto"
        style={{ zIndex: 20, opacity: 1, transition: "opacity 0.5s ease-out" }}
      >
        {/* Left Side - Text */}
        <div className="w-full md:w-1/3 space-y-6 md:space-y-8 text-center md:text-left mb-8 md:mb-0">
          <p
            ref={descriptionRef}
            className="text-black/80 font-light text-base md:text-lg leading-relaxed tracking-wide px-4 md:px-0"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            At TSK, we curate a timeless collection of luxurious kurtis,
            graceful sarees, contemporary tops, and more. Each piece is designed
            to blend traditional charm with modern sophistication — celebrating
            the essence of every woman.
          </p>
          <div
            ref={buttonRef}
            style={{ opacity: 0, transition: "all 0.5s ease-out" }}
          >
            <button
              onMouseEnter={() => handleButtonHover(true)}
              onMouseLeave={() => handleButtonHover(false)}
              className="px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm tracking-widest border border-black"
              style={{
                willChange: "transform, background-color, color",
                transition: "all 0.3s ease-out",
              }}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>

        {/* Right Side - Heading */}
        <div className="w-full md:w-1/3 text-center md:text-right mb-8 md:mb-0">
          <h1
            ref={headingRef}
            className="text-black font-light text-[2.5rem] md:text-[5.5rem] leading-[1.1] tracking-wide"
            style={{
              opacity: 0,
              transform: "translateY(-20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            CRAFTED
            <br />
            TO EMBRACE
            <br />
            <span className="font-extralight">ELEGANCE</span>
          </h1>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="fixed bottom-12 right-20 flex-col items-center hidden md:flex pointer-events-none"
        style={{
          zIndex: 30,
          opacity: 0,
          transform: "translateY(50px)",
          transition: "all 0.5s ease-out",
        }}
      >
        <div className="flex flex-col items-center">
          <p className="scroll-text text-sm tracking-[0.3em] mb-4 text-black/60 whitespace-nowrap">
            SCROLL TO EXPLORE
          </p>
          <div className="scroll-line w-[1px] h-16 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
