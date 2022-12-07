import { ActionTree, GetterTree, MutationTree } from "vuex";
import { GlobalState } from "..";
import { Actions, ActionsOptions, Getters, GettersOptions, Mutations, MutationsOptions, State } from "./types";

const state: State = {
  list: [],
};

const actions: ActionTree<State, GlobalState> & Actions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async [ActionsOptions.getList]({ commit, state, getters, dispatch, rootState, rootGetters }, payload) {
    await setTimeout(() => { console.log(11) }, 300);
    commit(MutationsOptions.updateList, [1, 2, 3]);
  }
};

const mutations: MutationTree<State> & Mutations = {
  updateList(state, payload) {
    state.list = payload;
  }
};

const getters: GetterTree<State, GlobalState> & Getters = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [GettersOptions.filterList]: (state, getters, rootState, rootGetters) => {
    return state.list?.filter((it, index) => index > 1);
  }
};
export default {
  state,
  getters,
  mutations,
  actions,
}

