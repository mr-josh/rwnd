import "theme/style.css";

import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Video } from "interfaces/video";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import TopCreatorCard from "components/TopCreatorCard";
import MostWatchedCard from "components/MostWatchedCard";
import CreatorsCard from "components/CreatorsCard";

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
        {watchHistory.length > 0 ? (
          <div className="cards">
            <CreatorsCard
              watchHistory={watchHistory}
              accessToken={accessToken || ""}
            />
            <MostWatchedCard
              watchHistory={watchHistory}
              accessToken={accessToken || ""}
            />
            <TopCreatorCard
              watchHistory={watchHistory}
              accessToken={accessToken || ""}
            />
          </div>
        ) : (
          <>
            {!accessToken ? (
              <button onClick={() => login()}>Login</button>
            ) : (
              <Dropzone onDrop={loadWatchHistory} accept={["application/json"]}>
                <h2>Upload your watch-history.json</h2>
                <p>Click here to select your watch-history.json file</p>
                <p>or drag and drop it here to upload</p>
              </Dropzone>
            )}
          </>
        )}
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
