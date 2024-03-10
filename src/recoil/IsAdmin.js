import { atom, selector } from "recoil"

export const IsAdmin = atom({
    key:'admin', //전역적으로 유일해야함
    default:'false'
});