import { RootCommit, RootContext, RootDispatch, RootStore } from "@/store/types";
import { GlobalActions, GlobalGetters, GlobalMutations, GlobalState } from '@/store';
// interface
export const ActionsOptions = {
  getList: 'getList',
} as const;

export const MutationsOptions = {
  updateList: 'updateList',
} as const;

export const GettersOptions = {
  filterList: 'filterList'
} as const;

export type State = {
  list: Record<string, any>[],
}
// Getters这块没有命名空间，只有自己的
type CurrentContext = RootContext<State, GlobalState, Actions, GlobalActions, Mutations, GlobalMutations, Getters, GlobalGetters>;
export type Actions = {
  [ActionsOptions.getList](context: CurrentContext, payload: any): Promise<void>,
}
export type Mutations = {
  [MutationsOptions.updateList](state: State, payload: any): void,
}

export type GettersTypes = (typeof GettersOptions)[keyof typeof GettersOptions];
export type Getters = {
  readonly [key in GettersTypes]: (state: State, getters: Getters, rootState: GlobalState, rootGetters: GlobalGetters) => any;
}

export type Store = RootStore<
  GlobalState,
  RootCommit<Mutations, GlobalMutations, false>,
  RootDispatch<Actions, GlobalActions, false>,
  {
    [key in keyof Getters as `${key}`]: ReturnType<Getters[key]>
  }
>
