const tabs = [
  { name: 'Bài viết', href: '/profile/{username}' },
  { name: 'Reels', href: '/profile/{username}/reels' },
  { name: 'Album', href: '/profile/{username}/albums' },
  { name: 'Đã lưu', href: '/profile/{username}/saved-posts', private: true },
  { name: 'Đã thích', href: '/profile/{username}/likes', private: true },
];

export default tabs;
