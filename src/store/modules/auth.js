import authApi from '@/api/auth';
import authService from '@/utils/auth';
import { userRoles } from '@/config';

// initial state
const initialState = {
  isLoggedIn: authService.isLoggedIn(),
  currentUser: authService.getUser(),
  loading: false,
};

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  currentUser: state => state.currentUser,
  loading: state => state.loading,
  isAdmin: state => state.currentUser && state.currentUser.role === userRoles.ADMIN,
};

const types = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',

  LOGOUT: 'LOGOUT',

  FETCH_CURRENT_USER_REQUEST: 'FETCH_CURRENT_USER_REQUEST',
  FETCH_CURRENT_USER_SUCCESS: 'FETCH_CURRENT_USER_SUCCESS',
  FETCH_CURRENT_USER_FAILURE: 'FETCH_CURRENT_USER_FAILURE',
};

const mutations = {
  /**
   * Login mutations group
   */
  [types.LOGIN_REQUEST](state) {
    state.loading = true;
  },
  [types.LOGIN_SUCCESS](state) {
    state.isLoggedIn = true;
  },
  [types.LOGIN_FAILURE](state) {
    state.isLoggedIn = false;
    state.loading = false;
  },
  /**
   * Registration mutations group
   */
  [types.SIGNUP_REQUEST](state) {
    state.loading = true;
  },
  [types.SIGNUP_SUCCESS](state) {
    state.isLoggedIn = true;
  },
  [types.SIGNUP_FAILURE](state) {
    state.isLoggedIn = false;
    state.loading = false;
  },
  /**
   * Logout mutation
   */
  [types.LOGOUT](state) {
    state.isLoggedIn = false;
    state.loading = false;
  },
  /**
   * Fetch current user
   */
  [types.FETCH_CURRENT_USER_REQUEST](state) {
    state.loading = true;
  },
  [types.FETCH_CURRENT_USER_SUCCESS](state, { user }) {
    state.currentUser = user;
    state.loading = false;
  },
  [types.FETCH_CURRENT_USER_FAILURE](state) {
    state.currentUser = {};
    state.loading = false;
  },
};

const actions = {
  login({ commit, dispatch }, credentials) {
    commit(types.LOGIN_REQUEST);

    return authApi.login(credentials).then(
      (data) => {
        authService.login(data.token);
        commit(types.LOGIN_SUCCESS);
        dispatch('getCurrentUser');
      },
      (err) => {
        commit(types.LOGIN_FAILURE, { err });
        throw err;
      },
    );
  },

  register({ commit }, credentials) {
    commit(types.SIGNUP_REQUEST);

    return authApi.register(credentials).then(
      (data) => {
        authService.login(data.token);
        authService.setUser(data.user);
        commit(types.SIGNUP_SUCCESS);
      },
      (err) => {
        commit(types.SIGNUP_FAILURE, { err });
        throw err;
      },
    );
  },

  logout({ commit }) {
    authService.logout();
    commit(types.LOGOUT);
  },

  getCurrentUser({ commit, dispatch, state }) {
    if (!state.isLoggedIn) {
      return null;
    }

    commit(types.FETCH_CURRENT_USER_REQUEST);
    return authApi.currentUser().then(
      (data) => {
        authService.setUser(data.user);
        commit(types.FETCH_CURRENT_USER_SUCCESS, { user: data.user });
      },
      (err) => {
        commit(types.FETCH_CURRENT_USER_FAILURE, { err });
        dispatch('logout');
        // throw err;
      },
    );
  },
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
};

export { types };
