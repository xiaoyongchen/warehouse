import { InjectionKey } from "vue";
import { createStore, createLogger, useStore as baseUseStore, Store as BaseStore } from "vuex";
import familyManager from "./modules/familyManager";
import { FamilyManagerState, FamilyManagerActions, FamilyManagerModuleName, FamilyManagerMutations, FamilyManagerGetters, FamilyManagerStore } from "./modules/familyManager/types";
import { RootGettersReturnType } from "./types";

const DEV = process.env.NODE_ENV !== 'production';

// 全局变量
export type GlobalState = {
    [FamilyManagerModuleName]: FamilyManagerState
};
export type GlobalActions = {
    [FamilyManagerModuleName]: FamilyManagerActions,
};
export type GlobalMutations = {
    [FamilyManagerModuleName]: FamilyManagerMutations,
};
export type GlobalGetters = RootGettersReturnType<FamilyManagerGetters, typeof FamilyManagerModuleName, true>;

type MainStore = FamilyManagerStore;

export const storeKey: InjectionKey<BaseStore<GlobalState>> = Symbol();
export function useStore(): MainStore {
    return baseUseStore(storeKey);
}
export default createStore({
    modules: {
        familyManager,
    },
    plugins: DEV ? [createLogger()] : [],
    strict: DEV,
    devtools: DEV,
});
