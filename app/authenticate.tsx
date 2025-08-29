import { useStytch } from "@stytch/react-native";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Authenticate({ token }: { token: string }) {
  const stytch = useStytch();
  const [sessionData, setSessionData] = useState();

  useEffect(() => {
    if (token && !sessionData) {
      stytch.oauth
        .authenticate(token, { session_duration_minutes: 60 })
        .then((resp: any) => setSessionData(resp));
    }
  }, [sessionData, stytch, token]);

  return <Redirect href="/wallet" />;
};
