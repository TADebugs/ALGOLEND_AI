// Type definitions for missing DOM types in Node.js environment
declare global {
  type BufferSource = ArrayBufferView | ArrayBuffer;
  
  interface ArrayBufferView {
    buffer: ArrayBuffer;
    byteLength: number;
    byteOffset: number;
  }
}

// Make it a module
export {};
