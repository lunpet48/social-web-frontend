'use client';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import styles from './page.module.scss';
import PostView from '@/component/PostView';
import SuggestFriend from '@/component/suggest-friend';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMenuSelected } from '@/store/slices/app';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMenuSelected(0));
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['post-view']}>
        <PostView />
      </div>
      <div className={styles['suggest-friend']}>
        <SuggestFriend />
      </div>
    </div>
  );
};

export default Home;
