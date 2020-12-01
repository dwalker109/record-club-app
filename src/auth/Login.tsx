import { memo, FC, useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { JsonDecoder } from "ts.data.json";
import { accessTokenState } from "../recoil/atoms";

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
  const setAccessToken = useSetRecoilState(accessTokenState);

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

        setAccessToken({
          tokenType: decoded.token_type,
          accessToken: decoded.access_token,
        });
      } catch {
        console.log("access token fail");
        setAccessToken(undefined);
      }
    })();
  }, [fetchAccessToken, setAccessToken]);

  return (
    <pre>{JSON.stringify(useRecoilValue(accessTokenState), undefined, 2)}</pre>
  );
};

export default memo(Login);
export { SpotifyCallback };
