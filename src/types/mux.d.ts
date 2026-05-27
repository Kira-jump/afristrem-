declare module "@mux/mux-node" {
  export default class Mux {
    constructor(opts: { tokenId: string; tokenSecret: string });
    video: {
      uploads: {
        create(opts: {
          cors_origin: string;
          new_asset_settings?: {
            playback_policy?: string[];
            encoding_tier?: string;
          };
        }): Promise<{ id: string; url: string; asset_id?: string; status?: string }>;
        retrieve(id: string): Promise<{
          id: string;
          status: string;
          asset_id?: string;
          url?: string;
        }>;
      };
      assets: {
        retrieve(id: string): Promise<{
          id: string;
          status: string;
          playback_ids?: { id: string; policy: string }[];
        }>;
      };
    };
  }
}

declare module "@mux/upchunk" {
  interface UploadOptions {
    endpoint: string;
    file: File;
    chunkSize?: number;
  }
  interface Upload {
    on(
      event: "progress",
      cb: (e: CustomEvent<number>) => void,
    ): void;
    on(event: "success", cb: () => void): void;
    on(event: "error", cb: (e: CustomEvent<{ message: string }>) => void): void;
  }
  const UpChunk: {
    createUpload(opts: UploadOptions): Upload;
  };
  export default UpChunk;
}
