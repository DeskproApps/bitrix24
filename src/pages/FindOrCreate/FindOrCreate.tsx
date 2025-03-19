import { TwoButtonGroup, useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkContact } from "../../components/Link/Contact";
import { Stack } from "@deskpro/deskpro-ui";
import { MutateObject } from "../../components/Mutate/Object";
import { ContextData, ISettings } from "../../types/settings";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export const FindOrCreate = ({ pageParam }: { pageParam?: 0 | 1 }) => {
  const [page, setPage] = useState<0 | 1>(pageParam || 0);

  const { context } = useDeskproLatestAppContext<ContextData, ISettings>();
  const { logoutActiveUser } = useLogout()
  const isUsingOAuth = context?.settings?.use_rest_api_url !== true || context.settings.use_advanced_connect === false

  const navigate = useNavigate();


  useInitialisedDeskproAppClient((client) => {

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("plusButton");


    if (isUsingOAuth) {
      client.registerElement("menuButton", {
        type: "menu",
        items: [
          {
            title: "Logout",
            payload: { type: "logout" },
          },

        ],
      });
    } else {
      client.deregisterElement("menuButton")
    }

  }, []);

  useDeskproAppEvents({
    async onElementEvent(id, _type, payload) {

      switch (id) {
        case "homeButton": {
          navigate("/home");
        }

      }


      if (payload && typeof payload === 'object' && 'type' in payload) {

        switch (payload.type) {
          case "logout": {
            if (isUsingOAuth) {
              logoutActiveUser()
            }
            break;
          }
        }
      }
    },
  });

  return (
    <Stack vertical style={{ padding: "8px" }}>
      <Stack style={{ alignSelf: "center" }}>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Contact"
          twoLabel="Create Contact"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        ></TwoButtonGroup>
      </Stack>

      {
        {
          0: <LinkContact />,
          1: <MutateObject objectName="Contact" />,
        }[page]
      }
    </Stack>
  );
};
