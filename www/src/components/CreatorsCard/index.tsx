import style from "./style.module.css";

import { Video } from "interfaces/video";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toSvg } from "jdenticon";

const CreatorsCard = (props: {
  watchHistory: Video[];
  accessToken?: string | null;
}) => {
  const [pics, setPic] = useState<{ [key: string]: string }>({});
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

    if (props.accessToken) {
      (async () => {
        let channelsString = channels
          .map((channel) => channel.url.split("/").at(-1))
          .join(",");
        let response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelsString}&fields=items%2Fsnippet%2Fthumbnails,items%2Fid`,
          {
            headers: {
              Authorization: `Bearer ${props.accessToken}`,
            },
          }
        );

        // TODO: Add error handling (rate limiting)
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
    } else {
      for (const channel of channels) {
        // Base64 encoded SVG
        let b64 = window.btoa(toSvg(channel.url, 48, { backColor: "#fff" }));
        setPic((prev) => ({
          ...prev,
          [channel.url.split("/").at(-1)!]: `data:image/svg+xml;base64,${b64}`,
        }));
      }
    }

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
          {channels.showcaseChannels.map((channel) => {
            return (
              <motion.a
                key={channel.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                title={channel.name}
                href={channel.url}
                target="_blank"
              >
                <img
                  src={pics[channel.url.split("/").at(-1)!]}
                  alt={channel.name}
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreatorsCard;
