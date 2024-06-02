'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.scss';
import useElementOnScreen from '@/hooks/useElementOnScreen';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleIsSoundOn } from '@/store/slices/app';

const VideoPlayerComponent = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPause, setIsPause] = useState<boolean | undefined>(undefined);
  // const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { ref, isVisible } = useElementOnScreen();

  const isSoundOn = useSelector((state: RootState) => state.app.isSoundOn);

  const dispatch = useDispatch();

  // update time at progress bar when video play
  useEffect(() => {
    const video = videoRef.current;

    const updateTime = () => {
      if (video) {
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
      }
    };

    if (video) {
      video.addEventListener('timeupdate', updateTime);
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', updateTime);
      }
    };
  }, []);

  // when scroll in/out video, video wil play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.played) {
        if (isVisible) {
          video.play();
        } else {
          video.pause();
        }
      }
    }
  }, [isVisible]);

  // make sound of video mute/unmute depend on isSoundOn value in redux
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isSoundOn;
    }
  }, [isSoundOn]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused || video.ended) {
        video.play();
        setIsPause(false);
      } else {
        video.pause();
        setIsPause(true);
      }
    }
  };

  const toggleMute = () => {
    dispatch(toggleIsSoundOn());
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const video = videoRef.current;
    if (video) {
      const clickPosition = event.nativeEvent.offsetX;
      const progressBarWidth = event.currentTarget.clientWidth;
      const clickPercentage = clickPosition / progressBarWidth;
      const newTime = clickPercentage * video.duration;
      video.currentTime = newTime;
    }
  };

  return (
    <div className={styles['video-wrapper']} ref={ref}>
      <video
        ref={videoRef}
        className={styles.video}
        onClick={togglePlayPause}
        autoPlay={true}
        muted={!isSoundOn}
        // loop
      >
        <source src={src} type='video/mp4' />
      </video>
      <div className={styles.action}>
        <div className={styles['duration-bar']}>
          <div className={styles['progress-bar']} onClick={handleProgressClick}>
            <progress
              style={{ width: '100%', height: '4px', appearance: 'none', color: 'red' }}
              value={currentTime}
              max={duration}
            />
          </div>
          <div>
            {formatTime(currentTime)}/{formatTime(duration)}
          </div>
        </div>
        <button style={{ fontSize: '20px' }} onClick={toggleMute}>
          {isSoundOn ? (
            <FontAwesomeIcon icon={faVolumeHigh} />
          ) : (
            <FontAwesomeIcon icon={faVolumeXmark} />
          )}
        </button>
      </div>
      {isPause && (
        <div className={styles.play} onClick={togglePlayPause}>
          <FontAwesomeIcon icon={faPlay} />
        </div>
      )}
    </div>
  );
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default VideoPlayerComponent;
