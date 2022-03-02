import { atom } from "recoil";

export const CameraMoveInfo = atom({
  key: "CamersMoveInfo",
  default: { x: 0, y: 0, z: 0 },
});
