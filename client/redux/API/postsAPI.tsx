import { Post } from '../../components/BrowsePosts'
import { REST_API } from './centralAPI'

export const postsAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], {category: string, country: string}>({
        query: ({category, country}) => `posts/${category}/${country}`,
    }),
    createPost: builder.mutation<string, Post>({
        query: (post) => ({ url: 'posts', method: 'POST', body: post }),
        async onQueryStarted(post, { dispatch }) {
          dispatch(
            postsAPI.util.updateQueryData('getUserPosts', undefined, (draft: Post[]) => {
              return [...draft, post]
            })
          )
        }
    }),
    getUserPosts: builder.query<Post[], void>({
      query: () => `posts/active`
    }),
    deletePost: builder.mutation<string, Post>({
      query: (post) => ({ url: `posts/delete/${post.post_id}`, method: 'DELETE' }),
      async onQueryStarted(post, { dispatch }) {
        dispatch(
          postsAPI.util.updateQueryData('getUserPosts', undefined, (draft: Post[]) => {
            return draft.filter(prev => prev.post_id !== post.post_id)
          })
        )
      }
    }),
    getPopularPosts: builder.query<Post[], void>({
      query: () => `posts/popular`
    })
  }),
  overrideExisting: true,
})

export const { useGetPostsQuery, useCreatePostMutation, useGetUserPostsQuery, useDeletePostMutation, useGetPopularPostsQuery } = postsAPI