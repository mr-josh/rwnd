import "theme/style.css";

import {
  Button,
  Group,
  MantineProvider,
  Notification,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconUpload, IconExternalLink } from "@tabler/icons";
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
              },
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
          <>
            <div className="start">
              {!accessToken ? (
                <Tooltip
                  label={
                    <>
                      <p>
                        You don't have to do this if you're worried about
                        security!
                      </p>
                      <p>You just won't see any channel profile pictures</p>
                    </>
                  }
                >
                  <Button onClick={() => login()} color="teal" fullWidth>
                    Login for Channel Profile Pictures
                  </Button>
                </Tooltip>
              ) : (
                <Notification
                  icon={<IconCheck size={20} />}
                  title="Success!"
                  color="green"
                  disallowClose
                  radius="md"
                >
                  You're logged in and should see channel profile pictures.
                </Notification>
              )}
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
                <Group position="center" spacing="xl">
                  <IconUpload size={40} />
                  <div>
                    <Text size="xl">Upload your watch-history.json</Text>
                    <Text color="dimmed">
                      Click here to select your watch-history.json file
                    </Text>
                    <Text color="dimmed">
                      or drag and drop it here to upload
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Button.Group>
                <Button
                  component="a"
                  href="/about"
                  target="_blank"
                  color="yellow"
                >
                  <span style={{ marginRight: "0.5rem" }}>About</span>
                  <IconExternalLink size={16} />
                </Button>
                <Button
                  component="a"
                  href="/guide"
                  target="_blank"
                  color="yellow"
                >
                  <span style={{ marginRight: "0.5rem" }}>Guide</span>
                  <IconExternalLink size={16} />
                </Button>
                <Button
                  component="a"
                  href="/privacy"
                  target="_blank"
                  color="yellow"
                >
                  <span style={{ marginRight: "0.5rem" }}>Privacy</span>
                  <IconExternalLink size={16} />
                </Button>
              </Button.Group>
              <hr style={{ width: "100%", borderColor: "white" }} />
              <div className="ad">
                <sup>
                  This ad below helps pay to keep the website up. It's the only
                  ad you'll ever see!
                </sup>
                <script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4301858556408185"
                  crossOrigin="anonymous"
                ></script>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-4301858556408185"
                  data-ad-slot="7625680943"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
                <script>
                  (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
              </div>
            </div>
          </>
        )}
      </div>
    </MantineProvider>
  );
};

export default App;
