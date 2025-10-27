import React, { useState, useEffect } from "react";

const LandingPage = ({
  onNavigate,
}: {
  onNavigate: (route: string) => void;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const features = [
    {
      title: "Easy Tracking",
      description:
        "Monitor all tickets in one centralized dashboard with real-time status updates and comprehensive overview.",
    },
    {
      title: "Smart Organization",
      description:
        "Categorize and prioritize tickets efficiently to handle urgent issues first and maintain workflow.",
    },
    {
      title: "Team Collaboration",
      description:
        "Work together seamlessly to resolve customer issues faster than ever with shared visibility.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Wave Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Decorative Circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-400 opacity-20 rounded-full"></div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              TicketFlow
            </h1>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Streamline your support workflow with intelligent ticket
              management. Track, manage, and resolve customer issues
              effortlessly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => onNavigate("login")}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate("signup")}
                className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <svg
          className="absolute bottom-0 w-full h-20 md:h-24"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64 C360,100 720,20 1440,64 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Features Section */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose TicketFlow?
        </h2>

        {/* Mobile Carousel */}
        <div className="sm:hidden relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {features.map((feature, idx) => (
              <div key={idx} className="w-full flex-shrink-0 px-4">
                <div className="bg-white p-6 rounded-xl shadow-md mx-auto max-w-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Decorative Circle */}
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute top-0 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40"></div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-gray-300 mb-2">
            &copy; 2025 TicketFlow. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Demo credentials - Email: demo@test.com | Password: password
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
