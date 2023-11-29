// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { Stack } from "@deskpro/deskpro-ui";
import { useEffect, useState } from "react";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import { LoadingSpinnerCenter } from "../components/LoadingSpinnerCenter/LoadingSpinnerCenter";

import { useNavigate } from "react-router-dom";
import {
  getContactById,
  getContactsByEmail,
  getDealsByContactId,
} from "../api/api";
import { useLinkContact } from "../hooks/hooks";
import contactJson from "../mapping/contact.json";
import dealJson from "../mapping/deal.json";

import { IContact } from "../types/contact";
import { IDeal } from "../types/deal";

export const Main = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [contactId, setContactId] = useState<string | null | undefined>(
    undefined
  );

  const { getLinkedContact, unlinkContact, linkContact } = useLinkContact();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Bitrix24");

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("menuButton");

    client.deregisterElement("link");

    client.deregisterElement("plusButton");

    client.registerElement("menuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink Contact",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });

    client.deregisterElement("editButton");

    client.registerElement("refreshButton", {
      type: "refresh_button",
    });
  }, []);

  useDeskproAppEvents(
    {
      async onElementEvent(id) {
        switch (id) {
          case "menuButton":
            unlinkContact().then(() => navigate("/findOrCreate"));

            break;
          case "homeButton":
            navigate("/redirect");
            break;
        }
      },
    },
    [unlinkContact]
  );

  useInitialisedDeskproAppClient(() => {
    (async () => {
      if (!context) return;

      const linkedContact = await getLinkedContact();

      if (!linkedContact || linkedContact.length === 0) {
        setContactId(null);

        return;
      }

      setContactId(linkedContact[0]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const contactQuery = useQueryWithClient(
    ["contact", contactId],
    (client) =>
      contactId === null
        ? getContactsByEmail(client, context?.data.user.primaryEmail)
        : getContactById(client, contactId as string),
    {
      enabled: contactId !== undefined && !!context?.data.user.primaryEmail,
      onError: () => unlinkContact().then(() => navigate("/findOrCreate")),
      onSuccess(data) {
        if (data?.result.length === 0) {
          navigate("/findOrCreate");
        }
        linkContact(contactId === null ? data?.result[0]?.ID : data?.result.ID);
      },
    }
  );

  const contactQuerytId =
    contactId === null
      ? contactQuery.data?.result[0]?.ID
      : contactQuery.data?.result.ID;

  const dealsByContactIdQuery = useQueryWithClient(
    ["dealsByContactId", contactQuery.isSuccess, contactQuerytId],
    (client) => getDealsByContactId(client, contactQuerytId),
    {
      enabled: !!contactQuerytId,
    }
  );

  if (!contactQuery.data && (contactQuery.isSuccess || contactQuery.isError))
    navigate("/findOrCreate");

  useEffect(() => {
    if (contactQuery.isError) {
      navigate("/findOrCreate");
    }
  }, [contactQuery, navigate]);

  if (contactQuery.isFetching || dealsByContactIdQuery.isFetching) {
    return <LoadingSpinnerCenter />;
  }

  if (!contactQuery.isSuccess || !dealsByContactIdQuery.isSuccess)
    return <div></div>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contact = contactQuery.data?.result;

  const deals = dealsByContactIdQuery.data?.result;

  return (
    <Stack style={{ width: "100%" }} vertical gap={10}>
      <FieldMapping
        fields={[contact]}
        metadata={contactJson.single}
        idKey={contactJson.idKey}
        internalChildUrl={contactJson.internalChildUrl}
        externalChildUrl={contactJson.externalChildUrl}
        childTitleAccessor={(e: IContact) => e.NAME}
      />
      <FieldMapping
        fields={deals ?? []}
        metadata={dealJson.list}
        idKey={dealJson.idKey}
        title={`Deals (${deals.length})`}
        internalUrl={dealJson.internalUrl + contactId}
        externalUrl={dealJson.externalUrl}
        internalChildUrl={dealJson.internalChildUrl}
        externalChildUrl={dealJson.externalChildUrl}
        childTitleAccessor={(e: IDeal) => e.TITLE}
        createPage="/create/Deal"
      />
    </Stack>
  );
};
