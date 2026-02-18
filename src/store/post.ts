import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { api } from '../configs/api';
import { Post } from '../types/post';

type PostStoreState = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
};

type PostStoreActions = {
  fetchAllPosts: () => Promise<void>;
  createPost: (
    data: Partial<Post>,
    accessToken: string
  ) => Promise<Post | null>;
  updatePost: (
    id: number,
    data: Partial<Post>,
    accessToken: string
  ) => Promise<Post | null>;
  clearError: () => void;
};

type PostStore = PostStoreState & PostStoreActions;

export const usePostStore = create<PostStore>()(
  devtools((set) => ({
    posts: [],
    isLoading: false,
    error: null,

    fetchAllPosts: async () => {
      set({ isLoading: true, error: null });
      // const accessToken = useAuthStore.getState().accessToken;
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axios.get<{ posts: Post[] }>(
          `${api.baseUrl}${api.posts}`,
          { headers: { 'x-access-token': accessToken } }
        );
        set({ posts: response.data.posts });
      } catch (error) {
        set({ error: (error as AxiosError).message });
        toast.error('Failed to fetch posts');
      } finally {
        set({ isLoading: false });
      }
    },

    createPost: async (data, accessToken) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post<{ post: Post }>(
          `${api.baseUrl}/posts`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken,
            },
          }
        );
        set((state) => ({
          posts: [...state.posts, response.data.post],
        }));
        toast.success('Post created successfully');
        return response.data.post;
      } catch (error) {
        set({ error: (error as AxiosError).message });
        toast.error('Failed to create post');
        return null;
      } finally {
        set({ isLoading: false });
      }
    },

    updatePost: async (id, data, accessToken) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.patch<{ post: Post }>(
          `${api.baseUrl}/posts/${id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken,
            },
          }
        );
        set((state) => ({
          posts: state.posts.map((p) => (p.ID === id ? response.data.post : p)),
        }));
        toast.success('Post updated successfully');
        return response.data.post;
      } catch (error) {
        set({ error: (error as AxiosError).message });
        toast.error('Failed to update post');
        return null;
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  }))
);

export default usePostStore;
