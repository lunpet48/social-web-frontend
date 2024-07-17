import { useEffect, useRef, useState } from 'react';
import styles from './MediaSlider.module.scss';
import { calculateSliderHeight, calculateSliderWidth, checkMediaType } from '@/utils';
import { MediaType } from '@/type/enum';
import VideoPlayerComponent from '../VideoPlayerComponent';
const MediaSlider = ({
  files,
  fixedWidth,
  fixedHeight,
  index,
  setIndex,
}: {
  files: string[];
  fixedWidth?: number;
  fixedHeight?: number;
  index?: number;
  setIndex?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [defaultIndexState, setDefaultIndexState] = useState(0);
  const currentIndex = index || defaultIndexState;
  const setCurrentIndex = setIndex || setDefaultIndexState;

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSliderDimensions();
  }, [sliderRef, fixedWidth, fixedHeight]);

  const setSliderDimensions = async () => {
    if (sliderRef.current) {
      const width = await calculateSliderWidth(fixedWidth, fixedHeight, files);
      const height = await calculateSliderHeight(fixedWidth, fixedHeight, files);
      if (sliderRef.current?.style) {
        sliderRef.current.style.width = width;
        sliderRef.current.style.height = height;
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  return (
    <div ref={sliderRef} className={styles['slider']}>
      {currentIndex > 0 && (
        <button className={styles['left-arrow']} onClick={goToPrevious}>
          &#10094;
        </button>
      )}
      {files?.map((file, index) => {
        if (checkMediaType(file) === MediaType.IMAGE) {
          return (
            <img key={index} src={file} style={{ left: `${(index - currentIndex) * 100}%` }} />
          );
        } else if (checkMediaType(file) === MediaType.VIDEO) {
          return (
            <div
              key={index}
              className={styles['video']}
              style={{
                left: `${(index - currentIndex) * 100}%`,
              }}
            >
              <VideoPlayerComponent src={file} />
            </div>
          );
        }
      })}
      {currentIndex < files.length - 1 && (
        <button className={styles['right-arrow']} onClick={goToNext}>
          &#10095;
        </button>
      )}
    </div>
  );
};

export default MediaSlider;
