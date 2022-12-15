import "theme/style.css";

import { Button, Group, MantineProvider, Text } from "@mantine/core";
import { IconCheck, IconUpload, IconExternalLink } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Video } from "interfaces/video";
import { useState } from "react";
import TopCreatorCard from "components/TopCreatorCard";
import MostWatchedCard from "components/MostWatchedCard";
import CreatorsCard from "components/CreatorsCard";
import VideosWatchedCard from "components/VideosWatchedCard";

const App = () => {
  const [watchHistory, setWatchHistory] = useState<Array<Video>>([]);

  const loadWatchHistory = async (files: FileWithPath[]) => {
    // TODO: Add error handling
    let data = JSON.parse(await files[0].text()) as Video[];

    setWatchHistory(
      data
        .filter((video) => video.titleUrl)
        .filter((video) => video.subtitles?.length > 0)
    );
  };

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
              <CreatorsCard watchHistory={watchHistory} />
            </Carousel.Slide>
            <Carousel.Slide>
              <MostWatchedCard watchHistory={watchHistory} />
            </Carousel.Slide>
            <Carousel.Slide>
              <TopCreatorCard watchHistory={watchHistory} />
            </Carousel.Slide>
          </Carousel>
        ) : (
          <div className="start">
            <Dropzone onDrop={loadWatchHistory} accept={["application/json"]}>
              <Group position="center" spacing="xl">
                <IconUpload size={40} />
                <div>
                  <Text size="xl">Upload your watch-history.json</Text>
                  <Text color="dimmed">
                    Click here to select your watch-history.json file
                  </Text>
                  <Text color="dimmed">or drag and drop it here to upload</Text>
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
          </div>
        )}
      </div>
    </MantineProvider>
  );
};

export default App;
