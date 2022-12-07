// types

import { ActionContext, CommitOptions, DispatchOptions, Store, Module } from "vuex";

// TObjFn: 定义一个属性为函数的对象
export type TObjFn = Record<string, (...args: any) => any>

type UnitTObjFn = Record<string, TObjFn | ((...args: any) => any)>

// 设置联合类型 例子：{ update: () => {}, familyManager: { getList: () => {} }}
export type FlatRootObj<T extends UnitTObjFn> =
  T extends Record<infer U, TObjFn | ((...args: any) => any)>
  ? (
    U extends keyof T ?
    (T[U] extends TObjFn ? { [key in keyof T[U]as `${Extract<U, string>}/${Extract<key, string>}`]: T[U][key] } : { [key in keyof T as `${Extract<U, string>}`]: T[U] })
    : never)
  : never

// 设置交叉类型
export type UnionToIntersection<U> =
  (U extends TObjFn ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type RootGettersReturnType<T extends Record<string, any>, ModuleName extends string = '', Namespaced extends boolean = false> = {
  readonly [key in keyof T as Namespaced extends true ? `${ModuleName}/${Extract<key, string>}` : `${Extract<key, string>}`]: T[key] extends ((...args: any) => any) ? ReturnType<T[key]> : never
}

// 定义currentGetters函数类型
export type GettersReturnType<T, K extends keyof T> = {
  [key in Exclude<keyof T, K>]: T[key] extends (...args: any) => any ? ReturnType<T[key]> : never
}

// 定义context

export type RootContext<
  CState,
  RState,
  CActions extends UnitTObjFn,
  RActions extends UnitTObjFn,
  CMutations extends UnitTObjFn,
  RMutations extends UnitTObjFn,
  CGetters extends TObjFn,
  RGetters extends TObjFn
  > = Omit<ActionContext<CState, RState>, 'commit' | 'dispatch' | 'getters' | 'rootGetters'>
  & RootDispatch<CActions, RActions, false>
  & RootCommit<CMutations, RMutations, false>
  & {
    getters: {
      [key in keyof CGetters]: ReturnType<CGetters[key]>
    }
  }
  & { rootGetters: RGetters }

export type RootDispatch<
  CActions extends UnitTObjFn,
  RActions extends UnitTObjFn,
  Namespaced extends boolean = true,
  > = {
    dispatch<
      M = Namespaced extends true
      ? UnionToIntersection<FlatRootObj<CActions>>
      : UnionToIntersection<FlatRootObj<RActions>>,
      K extends keyof M = keyof M
    >(
      key: K,
      payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
      options?: DispatchOptions
    ): Promise<ReturnType<Extract<M[K], (...args: any) => any>>>;
  };
export type RootCommit<
  CMutations extends UnitTObjFn,
  RMutations extends UnitTObjFn,
  Namespaced extends boolean = true,
  > = {
    commit<
      M = Namespaced extends true
      ? UnionToIntersection<FlatRootObj<CMutations>>
      : UnionToIntersection<FlatRootObj<RMutations>>,
      K extends keyof M = keyof M
    >(
      key: K,
      payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
      options?: CommitOptions
    ): void
  };

// 最外层RootStore
export type RootStore<
  RState extends Record<string, any>,
  RCommit extends { commit(type: string, payload?: any, options?: CommitOptions | undefined): void },
  RDispatch extends { dispatch(type: string, payload?: any, options?: DispatchOptions | undefined): Promise<any> },
  RGetters,
  > = Omit<Store<RState>, 'commit' | 'dispatch' | 'getters' | 'modules'> & RCommit & RDispatch & {
    getters: RGetters
  };

export type RootModule<
  CState extends Record<string, any>,
  RState extends Record<string, any>,
  CCommit extends { commit(type: string, payload?: any, options?: CommitOptions | undefined): void },
  CDispatch extends { dispatch(type: string, payload?: any, options?: DispatchOptions | undefined): Promise<any> },
  CGetters,
  > = Omit<Module<CState, RState>, 'commit' | 'dispatch' | 'getters'> & CCommit & CDispatch & {
    getters: CGetters
  };


