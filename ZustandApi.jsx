import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'https://jsonplaceholder.typicode.com';

async function sendRequest(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed (${response.status}). Please try again.`);
  if (response.status === 204) return null;
  return response.json();
}

const jsonHeaders = { 'Content-type': 'application/json; charset=UTF-8' };

export const useZustandApi = create(persist((set, get) => ({
  cartItems: [],
  favorites: [],
  reservations: [],
  lastReservation: null,
  cartOpen: false,
  favoritesOnly: false,
  activeBenefit: null,

  users: [],
  usersLoaded: false,
  usersLoading: false,
  usersError: '',
  addUserLoading: false,
  addUserError: '',
  addUserMessage: '',
  userActionBusyId: null,
  userActionError: '',
  userActionMessage: '',
  createdUserCount: 0,

  post: null,
  postLoading: false,
  postUpdating: false,
  postDeleting: false,
  postError: '',
  postMessage: '',

  addToCart: (product) => set((state) => {
    const existing = state.cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      return {
        cartItems: state.cartItems.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item),
        cartOpen: true,
      };
    }
    return { cartItems: [...state.cartItems, { product, quantity: 1 }], cartOpen: true };
  }),
  incrementCartItem: (productId) => set((state) => ({
    cartItems: state.cartItems.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item),
  })),
  decrementCartItem: (productId) => set((state) => ({
    cartItems: state.cartItems
      .map((item) => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.product.id !== productId || item.quantity > 0),
  })),
  removeCartItem: (productId) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.product.id !== productId),
  })),
  clearCart: () => set({ cartItems: [] }),
  reserveCart: () => {
    const { cartItems, reservations } = get();
    if (!cartItems.length) return false;
    const reservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({ ...item })),
    };
    set({ reservations: [reservation, ...reservations], lastReservation: reservation, cartItems: [] });
    return true;
  },
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openBenefit: (benefitId) => set({ activeBenefit: benefitId }),
  closeBenefit: () => set({ activeBenefit: null }),
  toggleFavoritesOnly: () => set((state) => ({ favoritesOnly: !state.favoritesOnly })),
  toggleFavorite: (productId) => set((state) => ({
    favorites: state.favorites.includes(productId)
      ? state.favorites.filter((id) => id !== productId)
      : [...state.favorites, productId],
  })),

  loadUsers: async () => {
    set({ usersLoading: true, usersError: '', addUserError: '', userActionError: '' });
    try {
      const users = await sendRequest(`${API_URL}/users`);
      set({ users: Array.isArray(users) ? users : [], usersLoaded: true });
    } catch (error) {
      set({ usersError: error.message || 'We could not load users. Please try again.' });
    } finally {
      set({ usersLoading: false });
    }
  },
  addUser: async () => {
    if (!get().usersLoaded) return;
    const number = get().createdUserCount + 1;
    set({ addUserLoading: true, addUserMessage: '', addUserError: '', userActionError: '', userActionMessage: '' });
    try {
      const data = await sendRequest(`${API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify({
          name: `New Demo User ${number}`,
          username: `new-demo-user-${number}`,
          email: 'new.user@example.com',
          address: { city: 'Cairo' },
        }),
        headers: jsonHeaders,
      });
      const createdUser = { ...data, apiId: data.id, id: `demo-${Date.now()}-${number}` };
      set((state) => ({
        users: [createdUser, ...state.users],
        createdUserCount: number,
        addUserMessage: 'User added. JSONPlaceholder simulates this request and does not save it on a server.',
      }));
    } catch (error) {
      set({ addUserError: error.message || 'The user could not be added. Please try again.' });
    } finally {
      set({ addUserLoading: false });
    }
  },
  updateUser: async (user, fields) => {
    set({ userActionBusyId: user.id, userActionError: '', userActionMessage: '' });
    const updatedUser = {
      ...user,
      ...fields,
      address: { ...(user.address || {}), city: fields.city },
    };
    try {
      const data = await sendRequest(`${API_URL}/users/${user.apiId ?? user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: jsonHeaders,
      });
      const savedUser = { ...updatedUser, ...data, address: { ...updatedUser.address, ...(data?.address || {}) } };
      set((state) => ({
        users: state.users.map((current) => current.id === user.id ? savedUser : current),
        userActionMessage: 'User updated. JSONPlaceholder simulates updates and does not save them on a server.',
      }));
      return true;
    } catch (error) {
      set({ userActionError: error.message || 'The user could not be updated. Please try again.' });
      return false;
    } finally {
      set({ userActionBusyId: null });
    }
  },
  deleteUser: async (user) => {
    set({ userActionBusyId: user.id, userActionError: '', userActionMessage: '' });
    try {
      await sendRequest(`${API_URL}/users/${user.apiId ?? user.id}`, { method: 'DELETE' });
      set((state) => ({
        users: state.users.filter((current) => current.id !== user.id),
        userActionMessage: 'User deleted from this page. JSONPlaceholder does not save deletions on a server.',
      }));
      return true;
    } catch (error) {
      set({ userActionError: error.message || 'The user could not be deleted. Please try again.' });
      return false;
    } finally {
      set({ userActionBusyId: null });
    }
  },

  loadPost: async () => {
    set({ postLoading: true, postError: '', postMessage: '' });
    try {
      const post = await sendRequest(`${API_URL}/posts/1`);
      set({ post });
      return post;
    } catch (error) {
      set({ postError: error.message || 'We could not load the post. Please try again.' });
      return null;
    } finally {
      set({ postLoading: false });
    }
  },
  updatePost: async (fields) => {
    const post = get().post;
    if (!post) return false;
    set({ postUpdating: true, postError: '', postMessage: '' });
    try {
      const updatedPost = await sendRequest(`${API_URL}/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...post, ...fields }),
        headers: jsonHeaders,
      });
      set({
        post: { ...post, ...updatedPost },
        postMessage: 'Post updated. JSONPlaceholder simulates this request and does not save changes on a server.',
      });
      return true;
    } catch (error) {
      set({ postError: error.message || 'The post could not be updated. Please try again.' });
      return false;
    } finally {
      set({ postUpdating: false });
    }
  },
  deletePost: async () => {
    const post = get().post;
    if (!post) return false;
    set({ postDeleting: true, postError: '', postMessage: '' });
    try {
      await sendRequest(`${API_URL}/posts/${post.id}`, { method: 'DELETE' });
      set({ post: null, postMessage: 'Post deleted from this page. JSONPlaceholder does not save deletions on a server.' });
      return true;
    } catch (error) {
      set({ postError: error.message || 'The post could not be deleted. Please try again.' });
      return false;
    } finally {
      set({ postDeleting: false });
    }
  },
}), {
  name: 'mustafa-store-state',
  partialize: (state) => ({
    cartItems: state.cartItems,
    favorites: state.favorites,
    reservations: state.reservations,
    lastReservation: state.lastReservation,
  }),
}));

export default useZustandApi;
