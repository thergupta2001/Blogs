import { atom } from "recoil";

export const loadingAtom = atom({
    key: "loadingAtom",
    default: false
})

export const usernameAtom = atom({
    key: "usernameAtom",
    default: null,
});

export const emailAtom = atom({
    key: "emailAtom",
    default: null
})