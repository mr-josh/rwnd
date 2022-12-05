import { Video } from "interfaces/video";
import { useMemo } from "react";
import style from "./style.module.css";

const VideosWatchedCard = (props: {
  watchHistory: Video[];
}) => {
  let watched = useMemo(() => {
    let uniqueVideos = new Map<string, Video>(
      props.watchHistory.map((video) => [video.titleUrl, video])
    );

    let since: Date | undefined;
    for (const video of props.watchHistory) {
      if (!since || new Date(video.time) < since) {
        since = new Date(video.time);
      }
    }

    return {
      watched: props.watchHistory.length,
      unique: uniqueVideos.size,
      since: (since as Date),
    };
  }, [props.watchHistory]);

  return (
    <div className={`card ${style.card}`}>
      <div className={`bubble ${style.bubble1}`}></div>
      <div className={`bubble ${style.bubble2}`}></div>
      <div className="header">
        <h1>You've watched {watched.watched} Videos</h1>
        <p>since {watched.since.toLocaleDateString()}</p>
      </div>
      <p>Let's see what else you've been up to on YouTube...</p>
    </div>
  );
};

export default VideosWatchedCard;
