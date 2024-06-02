import { useState } from 'react';
import styles from './MediaSlider.module.scss';
import { checkMediaType } from '@/utils';
import { MediaType } from '@/type/enum';
import VideoPlayerComponent from '../VideoPlayerComponent';
const MediaSlider = ({ files }: { files: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles['slider']}>
      {currentIndex > 0 && (
        <button className={styles['left-arrow']} onClick={goToPrevious}>
          &#10094;
        </button>
      )}
      {files?.map((file, index) => {
        if (checkMediaType(file) === MediaType.IMAGE) {
          return <img src={file} style={{ left: `${(index - currentIndex) * 100}%` }} />;
        } else if (checkMediaType(file) === MediaType.VIDEO) {
          return (
            <div
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
