import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [scrollPhase, setScrollPhase] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(2); // Start with center model
  const [mobileScrolled, setMobileScrolled] = useState(false);
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
    { id: 1, src: "/left_far.png", position: "left-far", collection: "Jeans" , link:"jeans"},
    {
      id: 2,
      src: "/left_near.png",
      position: "left-near",
      collection: "Sarees",
      link: "saree",
    },
    { id: 3, src: "/center.png", position: "center", collection: "Kurtis", link: "kurti" },
    {
      id: 4,
      src: "/right_near.png",
      position: "right-near",
      collection: "Western Wear",
      link: "western",
    },
    { id: 5, src: "/right_far.png", position: "right-far", collection: "Tops", link: "top" },
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

  // Mobile model navigation
  const navigateModel = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentModelIndex + 1) % models.length
        : (currentModelIndex - 1 + models.length) % models.length;

    setCurrentModelIndex(newIndex);
  };

  // Mobile scroll handler
  useEffect(() => {
    if (!isMobile) return;

    const handleMobileScroll = (e) => {
      if (e.deltaY > 0 && !mobileScrolled) {
        e.preventDefault(); // Prevent actual scrolling
        setMobileScrolled(true);
      } else if (e.deltaY < 0 && mobileScrolled) {
        e.preventDefault(); // Prevent actual scrolling
        setMobileScrolled(false);
      }
      // After the first scroll trigger, normal scrolling resumes automatically
    };

    window.addEventListener("wheel", handleMobileScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleMobileScroll);
  }, [isMobile, mobileScrolled]);

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
      // Hide top and bottom content
      if (mobileTopContentRef.current) {
        mobileTopContentRef.current.style.opacity = "0";
        mobileTopContentRef.current.style.transform = "translateY(-20px)";
        mobileTopContentRef.current.style.transition = "all 0.5s ease-out";
      }
      if (mobileBottomContentRef.current) {
        mobileBottomContentRef.current.style.opacity = "0";
        mobileBottomContentRef.current.style.transform = "translateY(20px)";
        mobileBottomContentRef.current.style.transition = "all 0.5s ease-out";
      }

      // Scale up center model
      if (mobileModelRef.current) {
        mobileModelRef.current.style.transform = "scale(1.2)";
        mobileModelRef.current.style.transition = "all 0.8s ease-out";
      }

      // Show arrows
      if (mobileArrowsRef.current) {
        mobileArrowsRef.current.style.opacity = "1";
        mobileArrowsRef.current.style.transition = "opacity 0.5s ease-out 0.3s";
      }
    } else {
      // Show top and bottom content
      if (mobileTopContentRef.current) {
        mobileTopContentRef.current.style.opacity = "1";
        mobileTopContentRef.current.style.transform = "translateY(0)";
      }
      if (mobileBottomContentRef.current) {
        mobileBottomContentRef.current.style.opacity = "1";
        mobileBottomContentRef.current.style.transform = "translateY(0)";
      }

      // Scale down center model
      if (mobileModelRef.current) {
        mobileModelRef.current.style.transform = "scale(1)";
      }

      // Hide arrows
      if (mobileArrowsRef.current) {
        mobileArrowsRef.current.style.opacity = "0";
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

  if (isMobile) {
    return (
      <div className="relative w-full h-screen bg-white overflow-hidden">
        {/* Mobile Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
          <div className="text-xl font-light tracking-widest">TSK</div>
          <Menu className="w-6 h-6" />
        </div>

        {/* Mobile Top Content */}
        <div
          ref={mobileTopContentRef}
          className="absolute top-0 left-0 right-0 z-30 pt-20 pb-8 flex flex-col items-center text-center px-6"
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "all 0.5s ease-out",
          }}
        >
          <h1 className="text-3xl font-light tracking-wide mb-4">
            CRAFTED TO
            <br />
            <span className="font-extralight">EMBRACE ELEGANCE</span>
          </h1>
        </div>

        {/* Mobile Models Container */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {/* Background Models */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Left background model */}
            <div
              className="absolute left-4 opacity-30 scale-75"
              style={{
                transform: `scale(0.6) translateX(-20px)`,
                filter: "blur(1px)",
                zIndex: 1,
              }}
            >
              <img
                src={
                  models[
                    (currentModelIndex - 1 + models.length) % models.length
                  ].src
                }
                alt="Left model"
                className="h-80 w-auto object-cover"
              />
            </div>

            {/* Right background model */}
            <div
              className="absolute right-4 opacity-30 scale-75"
              style={{
                transform: `scale(0.6) translateX(20px)`,
                filter: "blur(1px)",
                zIndex: 1,
              }}
            >
              <img
                src={models[(currentModelIndex + 1) % models.length].src}
                alt="Right model"
                className="h-80 w-auto object-cover"
              />
            </div>
          </div>

          {/* Center Model */}
          <div
            ref={mobileModelRef}
            className="relative z-10 cursor-pointer"
            style={{
              transform: "scale(1)",
              transition: "all 0.8s ease-out",
              willChange: "transform",
            }}
            onClick={handleMobileModelClick}
          >
            <img
              src={models[currentModelIndex].src}
              alt={`Model ${currentModelIndex + 1}`}
              className="h-96 w-auto object-cover"
            />

            {/* Collection Label */}
            <div
              className={`absolute -bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                mobileScrolled
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleMobileModelClick();
              }}
            >
              <span className="text-lg tracking-widest text-stone-600 cursor-pointer">
                {models[currentModelIndex].collection}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div
          ref={mobileArrowsRef}
          className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between z-40"
          style={{ opacity: 0, transition: "opacity 0.5s ease-out" }}
        >
          <button
            onClick={() => navigateModel("prev")}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={() => navigateModel("next")}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Mobile Bottom Content */}
        <div
          ref={mobileBottomContentRef}
          className="absolute bottom-0 left-0 right-0 z-30 pb-8 pt-4 flex flex-col items-center text-center px-6"
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "all 0.5s ease-out",
          }}
        >
          <p className="text-sm text-black/80 font-light leading-relaxed tracking-wide mb-6 max-w-xs">
            Curated collection of luxurious fashion pieces designed to blend
            traditional charm with modern sophistication.
          </p>
          <button className="px-6 py-2.5 text-xs tracking-widest border border-black hover:bg-black hover:text-white transition-colors">
            EXPLORE COLLECTION
          </button>
        </div>

        {/* Mobile Model Dots Indicator */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {models.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentModelIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentModelIndex ? "bg-black" : "bg-black/30"
              }`}
            />
          ))}
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

export default LandingPage;
