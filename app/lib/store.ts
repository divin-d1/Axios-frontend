// Store placeholder — Redux has been removed for offline compatibility.
// This file exists only to prevent import errors from StoreProvider.

export const makeStore = () => ({
  getState: () => ({}),
  dispatch: (action: any) => action,
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
