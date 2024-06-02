'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import 'bootstrap/dist/css/bootstrap.min.css';

const MediaView = ({
  autoSlide = false,
  autoSlideInterval = 3000,
  slides,
}: {
  autoSlide?: boolean;
  autoSlideInterval?: number;
  slides: string[];
}) => {
  const [curr, setCurr] = useState(0);

  const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className='overflow-hidden relative'>
      <div
        className='flex transition-transform ease-out duration-500'
        style={{ transform: `translateX(-${curr * 100}%)`, minWidth: 'auto' }}
      >
        {slides.map((img, index) => (
          //<object className="object-cover w-full h-fit" data={img} />
          // eslint-disable-next-line react/jsx-key
          <img src={img} className='object-contain w-full' />
          // <video src={img} controls autoPlay />
          //<object className="object-fit w-full h-fit" data={img} />
        ))}
      </div>
      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          style={curr === 0 ? { visibility: 'hidden' } : {}}
          onClick={prev}
          className='p-1 rounded-full shadow bg-gray-100 text-gray-800 hover:bg-white '
        >
          <ChevronLeft size={20} />
        </button>
        <button
          style={curr === slides.length - 1 ? { visibility: 'hidden' } : {}}
          onClick={next}
          className='p-1 rounded-full shadow bg-gray-100 text-gray-800 hover:bg-white'
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {slides.length !== 1 ? (
        <div className='absolute bottom-4 right-0 left-0'>
          <div className='flex items-center justify-center gap-2'>
            {slides.map((_, i) => (
              // eslint-disable-next-line react/jsx-key
              <div
                className={`
              transition-all w-1 h-1 bg-white rounded-full
              ${curr === i ? 'p-2' : 'bg-opacity-50'}
            `}
              />
            ))}
          </div>
        </div>
      ) : undefined}
    </div>
  );
};

export default MediaView;
