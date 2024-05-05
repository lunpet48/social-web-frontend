'use client';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import styles from './page.module.scss';
import PostView from '@/component/PostView';
import SuggestFriend from '@/component/suggest-friend';

const Home = () => {
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
