import { DefaultTheme } from "@react-navigation/native";
import { DefaultValue, atom, selector } from "recoil";

import { sjajTheme } from "../config/theme/gluestack";
import asyncStorage from "../utils/asyncStorage";

export const schoolThemeState = atom({
  key: "schoolThemeState",
  default: sjajTheme,
  effects: [
    async ({ setSelf, onSet }) => {
      setSelf(await asyncStorage.get("schoolThemeState", new DefaultValue()));
      onSet((newState, _, isReset) =>
        isReset
          ? asyncStorage.remove("schoolThemeState")
          : asyncStorage.set("schoolThemeState", newState),
      );
    },
  ],
});

export const navigationThemeSelector = selector({
  key: "navigationThemeSelector",
  get: ({ get }) => {
    const schoolTheme = get(schoolThemeState);

    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: schoolTheme.primary500,
      },
    };
  },
});

export const authState = atom({
  key: "authState",
  default: null,
  // effects: [
  //   async ({ setSelf, onSet }) => {
  //     setSelf(await asyncStorage.get("authState", new DefaultValue()));
  //     onSet((newState, _, isReset) =>
  //       isReset
  //         ? asyncStorage.remove("authState")
  //         : asyncStorage.set("authState", newState),
  //     );
  //   },
  // ],
});

export const userState = atom({
  key: "userState",
  default: null,
});
