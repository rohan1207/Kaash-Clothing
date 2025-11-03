import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import reviewsData from "../Data/reviews.json";

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  // Number of reviews to show at once (responsive)
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, slidesToShow]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev + slidesToShow >= reviewsData.length ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, reviewsData.length - slidesToShow) : prev - 1
    );
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Get visible reviews
  const visibleReviews = reviewsData.slice(
    currentIndex,
    currentIndex + slidesToShow
  );

  // Calculate total pages for dots
  const totalPages = Math.ceil(reviewsData.length / slidesToShow);
  const currentPage = Math.floor(currentIndex / slidesToShow);

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 ${
            i < rating ? "text-amber-400" : "text-stone-300"
          }`}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="relative w-full py-20 px-4 bg-gradient-to-br from-stone-50 via-white to-stone-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light mb-3">
            Success Stories That Inspire
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            See What Real Customers Say
          </h2>
        </motion.div>

        {/* Reviews Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => {
              handlePrev();
              setIsAutoPlaying(false);
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed group"
            disabled={currentIndex === 0}
            aria-label="Previous reviews"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-stone-700 transition-transform duration-300 group-hover:-translate-x-0.5"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              handleNext();
              setIsAutoPlaying(false);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed group"
            disabled={currentIndex + slidesToShow >= reviewsData.length}
            aria-label="Next reviews"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-stone-700 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -100 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.1,
                  }}
                  className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-amber-400/40"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Review Text */}
                  <p className="text-stone-700 text-sm font-light leading-relaxed mb-6 line-clamp-5">
                    {review.review}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mb-5" />

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-100"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-stone-900">
                        {review.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-light">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating and Product */}
                  <div className="flex items-center justify-between">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-stone-400 italic">
                      {review.product}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index * slidesToShow)}
              className={`transition-all duration-300 rounded-full ${
                currentPage === index
                  ? "w-8 h-2 bg-stone-900"
                  : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors duration-300 flex items-center gap-2"
          >
            {isAutoPlaying ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
                Play
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
