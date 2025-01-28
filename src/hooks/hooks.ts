import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { query } from "../utils/query";

export const useLinkContact = () => {
  const { context } = useDeskproLatestAppContext<{user: {id: number}}, never>();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const deskproUser = context?.data?.user;

  const linkContact = useCallback(
    async (contactId: string) => {
      const deskproUser = context?.data?.user;
      if (!context || !contactId || !client || !deskproUser) return;

      setIsLinking(true);


      const getEntityAssociationData = (await client
        ?.getEntityAssociation("bitrixContacts", String(deskproUser.id))
        .list()) as string[];

      if (getEntityAssociationData.length > 0) {
        await client
          ?.getEntityAssociation("bitrixContacts", String(deskproUser.id))
          .delete(getEntityAssociationData[0]);
      }

      await client
        ?.getEntityAssociation("bitrixContacts", String(deskproUser.id))
        .set(contactId);

      query.clear();

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client]
  );

  const getLinkedContact = useCallback(async () => {
    if (!client || !deskproUser) return;

    return await client
      .getEntityAssociation("bitrixContacts", String(deskproUser.id))
      .list();
  }, [client, deskproUser]);

  const unlinkContact = useCallback(async () => {
    if (!context || !client) return;

    const id = (await getLinkedContact())?.[0];

    if (!id) return;

    await client
      .getEntityAssociation("bitrixContacts", String(deskproUser?.id))
      .delete(id);
  }, [client, context, deskproUser, getLinkedContact]);

  return {
    getLinkedContact,
    linkContact,
    isLinking,
    unlinkContact,
    context,
    client,
  };
};
