import { GettersReturnType, RootCommit, RootContext, RootDispatch, RootModule, RootStore } from "@/store/types";
import { GlobalActions, GlobalMutations, GlobalState, GlobalGetters } from '@/store';
// interface
export const moduleName = 'familyManager';

export type ModuleName = typeof moduleName;
export const ActionsOptions = {
  getMessage: 'getMessage',
} as const;

export const MutationsOptions = {
  updateMessage: 'updateMessage',
} as const;

export const GettersOptions = {
  filterMessage: 'filterMessage'
} as const;

export type State = {
  message: string,
}

type CurrentContext = RootContext<State, GlobalState, Actions, GlobalActions, Mutations, GlobalMutations, Getters, GlobalGetters>;
export type Actions = {
  [ActionsOptions.getMessage](context: CurrentContext, payload: any): Promise<any>,
}
export type Mutations = {
  [MutationsOptions.updateMessage](state: State, payload: any): void,
}
export type GettersTypes = (typeof GettersOptions)[keyof typeof GettersOptions];
export type Getters = {
  readonly [key in GettersTypes]: (state: State, getters: GettersReturnType<Getters, key>, rootState: GlobalState, rootGetters: GlobalGetters) => any;
}

export type Module = RootModule<
  State,
  GlobalState,
  RootCommit<Mutations, GlobalMutations, true>,
  RootDispatch<Actions, GlobalActions, true>,
  {
    [key in keyof Getters as `${ModuleName}/${key}`]: ReturnType<Getters[key]>
  }
>



type ModuleState = Pick<GlobalState, 'familyManager'>
export type Store = RootStore<
  ModuleState,
  RootCommit<Mutations, GlobalMutations, false>,
  RootDispatch<Actions, GlobalActions, false>,
  {
    [key in keyof Getters as `${key}`]: ReturnType<Getters[key]>
  }
>


// 重命名
export type FamilyManagerModule = Module;
export type FamilyManagerStore = Store;

export const FamilyManagerModuleName = moduleName;
export type FamilyManagerState = State;
export type FamilyManagerGetters = Getters;
export type FamilyManagerActions = Actions;
export type FamilyManagerMutations = Mutations;
