import "theme/style.css";

import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Video } from "interfaces/video";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import TopCreatorCard from "components/TopCreatorCard";
import MostWatchedCard from "components/MostWatchedCard";
import CreatorsCard from "components/CreatorsCard";
import VideosWatchedCard from "components/VideosWatchedCard";

const App = () => {
  const [watchHistory, setWatchHistory] = useState<Array<Video>>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const loadWatchHistory = async (files: FileWithPath[]) => {
    // TODO: Add error handling
    let data = JSON.parse(await files[0].text()) as Video[];

    setWatchHistory(
      data
        .filter((video) => video.titleUrl)
        .filter((video) => video.subtitles?.length > 0)
    );
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    onSuccess: (response) => {
      setAccessToken(response.access_token);
    },
  });

  return (
    <BrowserRouter>
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <div className="page-header">
          <h1>RWND</h1>
          <p>Your personal YouTube Rewind</p>
        </div>
        <div className="page-content">
          {watchHistory.length > 0 ? (
            <Carousel
              className="cards"
              slideSize="min-content"
              slideGap="lg"
              withIndicators
              withControls={false}
              styles={{
                root: {
                  width: "100%",
                },
                viewport: {
                  width: "100%",
                  overflow: "visible",
                },
                indicator: {
                  height: 10,
                }
              }}
            >
              <Carousel.Slide>
                <VideosWatchedCard watchHistory={watchHistory} />
              </Carousel.Slide>
              <Carousel.Slide>
                <CreatorsCard
                  watchHistory={watchHistory}
                  accessToken={accessToken}
                />
              </Carousel.Slide>
              <Carousel.Slide>
                <MostWatchedCard
                  watchHistory={watchHistory}
                  accessToken={accessToken}
                />
              </Carousel.Slide>
              <Carousel.Slide>
                <TopCreatorCard
                  watchHistory={watchHistory}
                  accessToken={accessToken}
                />
              </Carousel.Slide>
            </Carousel>
          ) : (
            <div className="start">
              <button onClick={() => login()}>
                Login for Channel Profile Pictures
              </button>
              <Dropzone
                getFilesFromEvent={(e) => {
                  // Bug in @mantine/dropzone (https://github.com/mantinedev/mantine/issues/3115)
                  return Promise.resolve([
                    // @ts-ignore
                    ...(e.target as EventTarget & HTMLInputElement)?.files,
                  ]);
                }}
                onDrop={loadWatchHistory}
                accept={["application/json"]}
              >
                <h2>Upload your watch-history.json</h2>
                <p>Click here to select your watch-history.json file</p>
                <p>or drag and drop it here to upload</p>
              </Dropzone>
            </div>
          )}
        </div>
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
