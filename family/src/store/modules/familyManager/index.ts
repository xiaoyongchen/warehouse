import { GlobalState } from "@/store";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { State, Actions, Mutations, Getters, MutationsOptions, GettersOptions, ActionsOptions } from './types';

const state: State = {
  message: '11',
};

const actions: ActionTree<State, GlobalState> & Actions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async [ActionsOptions.getMessage]({ commit, state, getters, dispatch, rootState, rootGetters }, payload) {
    await setTimeout(() => { console.log(11) }, 300);
    // commit(MutationsOptions.updateMessage, '11');
  }
};

const mutations: MutationTree<State> & Mutations = {
  [MutationsOptions.updateMessage](state, payload) {
    state.message = payload;
  }
};

const getters: GetterTree<State, GlobalState> & Getters = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [GettersOptions.filterMessage]: (state, getters, rootState, rootGetters) => {
    return state.message + '1';
  }
};

const familyManager: Module<State, GlobalState> = {
  state,
  mutations,
  actions,
  getters,
  namespaced: true,
} as const;

export default familyManager;