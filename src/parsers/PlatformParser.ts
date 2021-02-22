// @flow
import { includes, map, compact, find } from "lodash";

interface Stream {
  bitrate: number;
  isLive: boolean;
  type: string | null;
  url: string;
  isAudioOnly: boolean;
}

interface Media {
  id: string;
  isAudioOnly: boolean;
  poster: string;
  title: string;
  streams: Array<Stream> | undefined;
}

export const getFormatType = (format: string): string | null => {
  switch (format) {
    case "m3u":
      return "application/x-mpegURL";
    case "mpeg4":
      return "video/mp4";
    case "mpeg-dash":
      return "application/xml+dash";
    default:
      return null;
  }
};

export const isAudioOnly = (assetTypes: Array<string>): boolean => {
  return includes(assetTypes, "Audio");
};

// Check types
export const getStreamingUrl = (releases: Array<any>): string | null => {
  const release = find(releases, { delivery: "streaming" });
  if (!release) return null;

  return release.url.replace("http://", "//");
};

export const parse = (data: any) => {
  const { id, title, defaultThumbnailUrl } = data;

  const media: Media = {
    id,
    isAudioOnly: false,
    poster: defaultThumbnailUrl,
    title,
    streams: undefined,
  };

  const streams: Array<Stream> = compact(
    map(data.content, (content) => {
      const streamIsAudioOnly = isAudioOnly(content.assetTypes);
      media.isAudioOnly = streamIsAudioOnly;

      const format = content.format.toLowerCase();
      const formatType = getFormatType(format);
      if (!formatType) return null; // Stream not suitable

      const streamUrl = getStreamingUrl(content.releases);
      if (!streamUrl) return null;

      return {
        bitrate: content.bitrate,
        isAudioOnly: streamIsAudioOnly,
        isLive: content.expression === "nonstop",
        url: streamUrl,
        type: formatType,
      };
    })
  );

  if (streams.length === 0) return null;

  media.streams = streams;
  return media;
};
