declare module "troika-three-text" {
  import type { ColorRepresentation, Object3D } from "three";

  export class Text extends Object3D {
    text: string;
    fontSize: number;
    color: ColorRepresentation;
    anchorX: string;
    anchorY: string;
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
