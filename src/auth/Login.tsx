import React, { FC, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { JsonDecoder } from "ts.data.json";

const Login: FC = () => {
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch(`/tokens/spotify-redirect`);
      const json = await response.json();
      setRedirectUrl(json.url);
    })();
  }, [setRedirectUrl]);

  return (
    <>
      <a href={redirectUrl}>Login with Spotify</a>
    </>
  );
};

const SpotifyCallback: FC = () => {
  const [, setCookie] = useCookies([]);

  const fetchAccessToken = useCallback(async (): Promise<unknown> => {
    const response = await fetch(`/tokens/spotify-cb${window.location.search}`); // Fwd OAuth response to API
    return await response.json();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const at = await fetchAccessToken();
        const decoded = await JsonDecoder.object(
          { token_type: JsonDecoder.string, access_token: JsonDecoder.string },
          "AT"
        ).decodePromise(at);
        global.localStorage.setItem("token_type", decoded.token_type);
        global.localStorage.setItem("access_token", decoded.access_token);
      } catch {
        console.log("access token fail");
      }
    })();
  }, [fetchAccessToken, setCookie]);

  return null;
};

export default React.memo(Login);
export { SpotifyCallback };
