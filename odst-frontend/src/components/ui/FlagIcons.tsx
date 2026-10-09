import React from 'react';

interface FlagProps {
  className?: string;
}

export const FlagID: React.FC<FlagProps> = ({ className = "w-4 h-3" }) => (
  <svg
    viewBox="0 0 640 480"
    className={`rounded-[2px] overflow-hidden shadow-sm shrink-0 border border-white/20 ${className}`}
    aria-hidden="true"
  >
    <path fill="#e11d48" d="M0 0h640v240H0z" />
    <path fill="#ffffff" d="M0 240h640v240H0z" />
  </svg>
);

export const FlagEN: React.FC<FlagProps> = ({ className = "w-4 h-3" }) => (
  <svg
    viewBox="0 0 640 480"
    className={`rounded-[2px] overflow-hidden shadow-sm shrink-0 border border-white/20 ${className}`}
    aria-hidden="true"
  >
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 64V0h75z" />
    <path fill="#C8102E" d="m424 288 216 159v33l-260-192h44zm141-288L361 153l25 35L626 14A24 24 0 0 0 565 0zM0 447l196-147-24-34L0 417v30zM0 33l215 160h45L0 0v33z" />
    <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z" />
    <path fill="#C8102E" d="M266 0v480h108V0H266zM0 186v108h640V186H0z" />
  </svg>
);

export const FlagAR: React.FC<FlagProps> = ({ className = "w-4 h-3" }) => (
  <svg
    viewBox="0 0 640 480"
    className={`rounded-[2px] overflow-hidden shadow-sm shrink-0 border border-white/20 ${className}`}
    aria-hidden="true"
  >
    <path fill="#165d31" d="M0 0h640v480H0z" />
    <path
      fill="#ffffff"
      d="M170 310h300v14H170zm18-52c15-8 35-12 55-8 12 3 22 10 32 18 10-8 20-15 32-18 20-4 40 0 55 8 18 10 28 26 28 42H160c0-16 10-32 28-42z"
    />
    <circle cx="320" cy="210" r="18" fill="#ffffff" />
  </svg>
);
