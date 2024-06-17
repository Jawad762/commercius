import { Post } from '../../components/BrowsePosts'
import { store } from '../store'
import { REST_API } from './centralAPI'
import { postsAPI } from './postsAPI'

const favoritesAPI = REST_API.injectEndpoints({
  endpoints: (builder) => ({
      getFavorites: builder.query<Post[], void>({
        query: () => `favorites`,
      }),
      addToFavorites: builder.mutation<string, { post: Post }>({
        query: ({ post }) => ({ url: 'favorites', method: 'POST', body: { post_id: post.post_id }}),
        async onQueryStarted({ post }, { dispatch }) {
          dispatch(
            favoritesAPI.util.updateQueryData('getFavorites', undefined, (draft: Post[]) => {
              const doesPostExist = draft.find(existingPost => post.post_id === existingPost.post_id)
              if (doesPostExist) return draft.filter(existingPost => existingPost.post_id !== post.post_id)
              const newPost = {...post, is_item_in_favorites: true}
              return [...draft, newPost]
            })
          )
          dispatch(
            postsAPI.util.updateQueryData('getPosts', { category: post.category, country: store?.getState().user.user?.country as string }, (draft: Post[]) => {
              const newPosts = draft.map(prevPost => {
                if (prevPost.post_id === post.post_id) {
                  return {...prevPost, is_item_in_favorites: !prevPost.is_item_in_favorites }
                }
                return prevPost
              })
              return newPosts
            })
          )
        }
      }),
      removeFromFavorites: builder.mutation<string, { post: Post }>({
        query: ({ post }) => ({ url: `favorites/${post.post_id}`, method: 'DELETE'}),
        async onQueryStarted({ post }, { dispatch }) {
          dispatch(
            favoritesAPI.util.updateQueryData('getFavorites', undefined, (draft: Post[]) => {
              return draft.filter(prev => prev.post_id !== post.post_id)
            })
          )
          dispatch(
            postsAPI.util.updateQueryData('getPosts', { category: post.category, country: store?.getState().user.user?.country as string }, (draft: Post[]) => {
              const newPosts = draft.map(prevPost => {
                if (prevPost.post_id === post.post_id) {
                  return {...prevPost, is_item_in_favorites: false}
                }
                return prevPost
              })
              return newPosts
            })
          )
        }
      })
  }),
  overrideExisting: true,
})

export const { useGetFavoritesQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } = favoritesAPI