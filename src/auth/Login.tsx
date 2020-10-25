import React, { FC, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { v4 as uuid } from "uuid";

const jwtCookieKey = "jwt";

const Login: FC = () => {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [, setCookie] = useCookies([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/oauth/spotify-redirect`);
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

  const fetchJwt = useCallback(async (): Promise<string> => {
    const response = await fetch(`/oauth/spotify-cb${window.location.search}`); // Fwd OAuth response to API
    const json = await response.json();

    return json.jwt;
  }, []);

  useEffect(() => {
    (async () => {
      const jwt = await fetchJwt();
      setCookie(jwtCookieKey, jwt);
      alert(jwt);
    })();
  }, [fetchJwt, setCookie]);

  return null;
};

export default React.memo(Login);
export { SpotifyCallback };
