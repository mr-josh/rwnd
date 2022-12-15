import style from "./style.module.css";

import { Video } from "interfaces/video";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toSvg } from "jdenticon";

const MostWatchedCard = (props: { watchHistory: Video[] }) => {
  const [pics, setPic] = useState<{ [key: string]: string }>({});
  let topChannels = useMemo(() => {
    // Find the top creator
    let creatorsWatched: Map<
      string,
      { name: string; url: string; count: number }
    > = new Map();

    for (const video of props.watchHistory) {
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

    let channels = Array.from(creatorsWatched.values())
      .sort((a, b) => {
        return b.count - a.count;
      })
      .slice(0, 7);

    (async () => {
      let channelsString = channels
        .map((channel) => channel.url.split("/").at(-1))
        .join(",");
      let response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelsString}&fields=items%2Fsnippet%2Fthumbnails,items%2Fid&key=${
          import.meta.env.VITE_YT_API_KEY
        }`
      );

      let data = await response.json();

      let profilePics = data.items.reduce(
        (acc: { [key: string]: string }, item: any) => {
          acc[item.id] = item.snippet.thumbnails.default.url;
          return acc;
        },
        {}
      );

      setPic(profilePics);
    })();

    return channels;
  }, [props.watchHistory]);

  return (
    <div className="card">
      <div className={`${style.bubble} ${style.bubble1}`}></div>
      <div className={`${style.bubble} ${style.bubble2}`}></div>
      <div className="header">
        <h1>These channels</h1>
        <p>you watch the most...</p>
      </div>
      <div className={style.channels}>
        {topChannels.map((channel, i) => {
          if (i < 3)
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <a href={channel.url} target="_blank">
                  <img
                    src={pics[channel.url.split("/").at(-1)!]}
                    onError={(e) => {
                      // If failed, use jdenticon
                      let original = e.currentTarget.src;
                      let b64 = window.btoa(
                        toSvg(original, 48, { backColor: "#fff" })
                      );
                      e.currentTarget.src = `data:image/svg+xml;base64,${b64}`;

                      // Try again after 1-2 seconds
                      const retry = function (this: typeof e) {
                        this.currentTarget.src = original;
                      };
                      setTimeout(retry.bind(e), 1000 + Math.random() * 1000);
                    }}
                  />
                </a>
                <div>
                  <a href={channel.url} target="_blank">
                    <h3>{channel.name}</h3>
                  </a>
                  <p>{channel.count} videos watched</p>
                </div>
              </motion.article>
            );
        })}
        <article
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {topChannels.map((channel, i) => {
            if (i < 3) return;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  title={channel.name}
                  href={channel.url}
                  target="_blank"
                >
                  <img
                    src={pics[channel.url.split("/").at(-1)!]}
                    onError={(e) => {
                      // If failed, use jdenticon
                      let original = e.currentTarget.src;
                      let b64 = window.btoa(
                        toSvg(original, 48, { backColor: "#fff" })
                      );
                      e.currentTarget.src = `data:image/svg+xml;base64,${b64}`;

                      // Try again after 1-2 seconds
                      const retry = function (this: typeof e) {
                        this.currentTarget.src = original;
                      };
                      setTimeout(retry.bind(e), 1000 + Math.random() * 1000);
                    }}
                  />
                </motion.a>
                <p>{channel.count} videos</p>
              </div>
            );
          })}
        </article>
      </div>
    </div>
  );
};

export default MostWatchedCard;
