import style from "./style.module.css";

import { Video } from "interfaces/video";
import { useMemo, useState } from "react";
import { toSvg } from "jdenticon";

const TopCreatorCard = (props: { watchHistory: Video[] }) => {
  const [pic, setPic] = useState<string>();
  let topCreator = useMemo(() => {
    // Find the top creator
    let creatorsWatched: Map<
      string,
      { name: string; url: string; count: number }
    > = new Map();

    let uniqueVideos = new Map<string, Video>(
      props.watchHistory.map((video) => [video.titleUrl, video])
    );

    for (const video of uniqueVideos.values()) {
      if (creatorsWatched.has(video.subtitles[0].url)) {
        creatorsWatched.get(video.subtitles[0].url)!.count++;
      } else {
        creatorsWatched.set(video.subtitles[0].url, {
          name: video.subtitles[0].name,
          url: video.subtitles[0].url,
          count: 1,
        });
      }
    }

    let creator = Array.from(creatorsWatched.values()).reduce((prev, curr) =>
      prev.count > curr.count ? prev : curr
    );

    (async () => {
      let response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${creator.url
          .split("/")
          .at(-1)}&fields=items%2Fsnippet%2Fthumbnails&key=${
          import.meta.env.VITE_YT_API_KEY
        }`
      );

      // TODO: Add error handling (rate limiting)
      let data = await response.json();

      setPic(data.items[0].snippet.thumbnails.high.url);
    })();

    return creator;
  }, [props.watchHistory]);

  return (
    <div className={`card ${style.card}`}>
      <div className={`bubble ${style.bubble1}`}></div>
      <div className={`bubble ${style.bubble2}`}></div>
      <div className="header">
        <h1>Your #1 Creator</h1>
        <p>with {topCreator.count} unique videos watched, is...</p>
      </div>
      <img
        src={pic || "https://via.placeholder.com/800"}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          // If failed, use jdenticon
          let original = target.src;
          let b64 = window.btoa(toSvg(original, 48, { backColor: "#fff" }));
          target.src = `data:image/svg+xml;base64,${b64}`;

          // Try again after 1-2 seconds
          const retry = function (this: typeof e) {
            target.src = original;
          };
          setTimeout(retry.bind(e), 1000 + Math.random() * 1000);
        }}
        className={style.profileImage}
      ></img>
      <a href={topCreator.url} target="_blank">
        <h2>{topCreator.name}</h2>
      </a>
    </div>
  );
};

export default TopCreatorCard;
