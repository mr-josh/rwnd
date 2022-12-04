import { Video } from "interfaces/video";
import { useMemo, useState } from "react";
import style from "./style.module.css";
import { motion } from "framer-motion";

const MostWatchedCard = (props: {
  watchHistory: Video[];
  accessToken: string;
}) => {
  const [pics, setPic] = useState<string[]>([]);
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
      for (const channel of channels) {
        let response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channel.url
            .split("/")
            .at(-1)}&fields=items%2Fsnippet%2Fthumbnails`,
          {
            headers: {
              Authorization: `Bearer ${props.accessToken}`,
            },
          }
        );

        // TODO: Add error handling (rate limiting)
        let data = await response.json();

        await new Promise((resolve, _reject) => {
          setTimeout(() => {
            resolve(null);
          }, 500);
        });

        setPic((prev) => [...prev, data.items[0].snippet.thumbnails.high.url]);
      }
    })();

    return channels;
  }, [props.watchHistory]);

  return (
    <div className="card">
      <div className={`${style.bubble} ${style.bubble1}`}></div>
      <div className={`${style.bubble} ${style.bubble2}`}></div>
      <div className="header">
        <h1>These channels</h1>
        <p>you watched the most...</p>
      </div>
      <div className={style.channels}>
        {topChannels.map((channel, i) => {
          if (i < 3 && pics[i])
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <a href={channel.url} target="_blank">
                  <img src={pics[i]} />
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
            if (i < 3 || !pics[i]) return;
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
                  <img src={pics[i]} />
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
