import { useCallback, useState } from 'react';
import { Post, PostService } from 'vitorpmaringolo-sdk';

export default function useLatestPosts() {
  const [posts, setPosts] = useState<Post.Paginated>();

  const fetchPosts = useCallback(() => {
    PostService.getAllPosts({
      sort: ['createdAt', 'desc'],
      page: 0,
      size: 3,
    }).then(setPosts);
  }, []);

  return {
    posts: posts?.content,
    fetchPosts,
  };
}
