// Global type declarations for missing DOM types
declare global {
  type BufferSource = ArrayBufferView | ArrayBuffer;
  type BufferView =Uint8Array|Int8Array|DataView;
//   interface ArrayBufferView {
//     buffer: ArrayBuffer;
//     byteLength: number;
//     byteOffset: number;
//   }

}

export {};
