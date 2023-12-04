import {
  adminGenericProxyFetch,
  useDeskproAppClient,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { Button, H5, Stack } from "@deskpro/deskpro-ui";
import { useState } from "react";

export const Verify = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const [response, setResponse] = useState<{
    message: string | null;
    type: string | null;
  }>({
    message: null,
    type: null,
  });

  const verify = async () => {
    if (!client || !context?.settings.rest_api_url) return;

    const fetch = await adminGenericProxyFetch(client);

    try {
      const response = await fetch(
        context?.settings.rest_api_url + "user.current.json"
      );

      const text = await response.text();

      if (response.status !== 200) throw new Error(text);

      setResponse({
        message: "Success!",
        type: "success",
      });
    } catch (error) {
      setResponse({
        message: (error as Error).message,
        type: "error",
      });
    }
  };

  return (
    <Stack vertical gap={5}>
      <Button onClick={verify} text="Verify" title="Verify"></Button>
      {response.message !== null && (
        <H5
          style={
            response.type === "error"
              ? {
                  color: theme?.colors.red40,
                }
              : {
                  color: theme?.colors.green80,
                }
          }
        >
          {response.type === "error"
            ? "Error, please make sure to follow the Setup tutorial"
            : "Success!"}
        </H5>
      )}
    </Stack>
  );
};
