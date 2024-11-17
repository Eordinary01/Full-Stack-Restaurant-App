import React from 'react';

export default function RestaurantBanner({ restaurant }) {
  return (
    <div className="relative h-72 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background Base */}
        <rect width="100%" height="100%" fill="#FF7043" />
        
        {/* Decorative Pattern */}
        <path
          d="M0 0l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25"
          stroke="#FF8A65"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.5"
        />
        
        {/* Repeated for visual interest */}
        <path
          d="M100 0l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25l-50 25l50 25"
          stroke="#FF8A65"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.5"
          transform="translate(100, 0)"
        />
        
        {/* Utensils Pattern */}
        <g opacity="0.1" fill="#FFF">
          {/* Fork */}
          <path d="M40 40h4v20h-4zm0 24h4v40h-4zm8-24h4v20h-4zm0 24h4v40h-4zm8-24h4v20h-4zm0 24h4v40h-4z" />
          
          {/* Knife */}
          <path d="M80 40l20 4l-4 60l-16-4z" />
          
          {/* Plate */}
          <circle cx="150" cy="60" r="30" />
          <circle cx="150" cy="60" r="25" fill="#FF7043" />
        </g>

        {/* Abstract Food Elements */}
        <g opacity="0.15">
          <circle cx="250" cy="50" r="20" fill="#FFF" />
          <circle cx="290" cy="90" r="15" fill="#FFF" />
          <circle cx="240" cy="100" r="12" fill="#FFF" />
        </g>

        {/* Overlay Gradient */}
        <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <rect width="100%" height="100%" fill="url(#overlay)" />

        {/* Geometric Accents */}
        <g opacity="0.1" fill="#FFF">
          <circle cx="900" cy="50" r="100" />
          <circle cx="950" cy="150" r="80" />
          <circle cx="850" cy="180" r="60" />
        </g>
      </svg>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {restaurant.name}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl drop-shadow-md">
            {restaurant.description}
          </p>
        </div>
      </div>
    </div>
  );
}