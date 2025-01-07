import React from 'react';

export default function RestaurantBanner({ restaurant }) {
  return (
    <div className="relative h-80 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2B1B17" />
            <stop offset="100%" stopColor="#4A1C1C" />
          </linearGradient>

          {/* Texture Pattern */}
          <pattern id="smallDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#fff" opacity="0.1" />
          </pattern>

          {/* Abstract Food Shapes */}
          <clipPath id="plateShape">
            <circle cx="60" cy="60" r="50" />
          </clipPath>

          {/* Decorative Elements */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Base */}
        <rect width="100%" height="100%" fill="url(#heroGradient)" />
        <rect width="100%" height="100%" fill="url(#smallDots)" />

        {/* Decorative Circles */}
        <circle cx="1000" cy="100" r="300" fill="#D4AF37" opacity="0.1">
          <animate
            attributeName="r"
            values="300;310;300"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="1100" cy="200" r="200" fill="#FFF" opacity="0.05">
          <animate
            attributeName="r"
            values="200;210;200"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Abstract Food Elements */}
        <g transform="translate(100, 50)" opacity="0.8">
          {/* Stylized Plate */}
          <circle cx="60" cy="60" r="50" fill="#FFF" opacity="0.1" />
          <path
            d="M30 60a30 30 0 0 1 60 0"
            stroke="#D4AF37"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              values="M30 60a30 30 0 0 1 60 0;M30 65a30 30 0 0 1 60 0;M30 60a30 30 0 0 1 60 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Dynamic Lines */}
        <g opacity="0.2">
          {[...Array(5)].map((_, i) => (
            <path
              key={i}
              d={`M${-200 + i * 400} 400 Q ${400 + i * 100} ${150 + i * 50} ${1200 + i * 400} 400`}
              stroke="#D4AF37"
              strokeWidth="1"
              fill="none"
            >
              <animate
                attributeName="d"
                values={`
                  M${-200 + i * 400} 400 Q ${400 + i * 100} ${150 + i * 50} ${1200 + i * 400} 400;
                  M${-200 + i * 400} 400 Q ${400 + i * 100} ${200 + i * 50} ${1200 + i * 400} 400;
                  M${-200 + i * 400} 400 Q ${400 + i * 100} ${150 + i * 50} ${1200 + i * 400} 400
                `}
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>

        {/* Floating Elements */}
        <g className="floating-elements">
          {[...Array(8)].map((_, i) => (
            <g key={i} transform={`translate(${150 * i}, ${50 + (i % 3) * 30})`}>
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#D4AF37"
                opacity="0.3"
              >
                <animate
                  attributeName="cy"
                  values={`${50 + (i % 3) * 30};${30 + (i % 3) * 30};${50 + (i % 3) * 30}`}
                  dur={`${2 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Overlay Gradient */}
        <linearGradient id="overlayGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
        </linearGradient>
        <rect width="100%" height="100%" fill="url(#overlayGradient)" />
      </svg>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-12">
        <div className="max-w-4xl">
          {/* Restaurant Type Badge */}
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Fine Dining Experience
            </span>
          </div>
          
          {/* Restaurant Name */}
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            {restaurant.name}
          </h1>
          
          {/* Description */}
          <p className="text-white/90 text-xl font-light leading-relaxed max-w-2xl">
            {restaurant.description}
          </p>
          
          {/* Optional Rating/Info */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">4.9</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <span className="text-white/90">Open Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}