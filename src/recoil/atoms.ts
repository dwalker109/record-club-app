import { atom } from "recoil";

type AccessToken = {
    tokenType: string;
    accessToken: string;
}

export const accessTokenState = atom<AccessToken | undefined>({
    key: "accessTokenState", default: undefined
});