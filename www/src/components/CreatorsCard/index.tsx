import { Video } from "interfaces/video";
import { useMemo, useState } from "react";
import style from "./style.module.css";
import { motion } from "framer-motion";

const CreatorsCard = (props: {
  watchHistory: Video[];
  accessToken: string;
}) => {
  const [pics, setPic] = useState<string[]>([]);
  let channels = useMemo(() => {
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
      .slice(0, 50);

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

    return {
      count: creatorsWatched.size,
      showcaseChannels: channels,
    };
  }, [props.watchHistory]);

  return (
    <div className="card">
      <div className={`bubble ${style.bubble1}`}></div>
      <div className={`bubble ${style.bubble2}`}></div>
      <div className="header">
        <h1>You've watched {channels.count} different creators</h1>
        <div className={style.channels}>
          {channels.showcaseChannels.map((channel, index) => {
            if (!pics[index]) return;
            return (
              <motion.a
                key={channel.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                title={channel.name}
                href={channel.url}
                target="_blank"
              >
                <img src={pics[index]} alt={channel.name} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreatorsCard;
