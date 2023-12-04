import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getActivitiesTasksByContactId,
  getActivitiesTasksByDealId,
  getContactById,
  getDealById,
  getDealsByContactId,
  getProductsByDealId,
} from "../../api/api";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import contactJson from "../../mapping/contact.json";
import dealJson from "../../mapping/deal.json";
import activityJson from "../../mapping/activity.json";

import { H2, Stack } from "@deskpro/deskpro-ui";
import { makeFirstLetterUppercase } from "../../utils/utils";
import { IDeal } from "../../types/deal";
import { IContact } from "../../types/contact";

type AcceptedFunctions =
  | typeof getContactById
  | typeof getDealById
  | typeof getDealsByContactId;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTitle = (e: any, objectName: string) => {
  switch (objectName) {
    case "Deal": {
      return e.TITLE;
    }
    case "Contact": {
      return e.NAME;
    }
  }
};

export const ViewObject = () => {
  const navigate = useNavigate();
  const { objectName, objectId, objectView } = useParams();

  const entity_type_id = objectName === "Deal" ? "2" : "3";

  const correctJson = useMemo(() => {
    switch (objectName) {
      case "Contact":
        return contactJson;
      case "Deal":
        return dealJson;
    }
  }, [objectName]);

  const objectQuery = useQueryWithClient<
    Awaited<ReturnType<AcceptedFunctions>>
  >(
    [objectName as string, objectId as string, objectView as string],
    (client) => {
      switch (objectName as "Contact" | "Deal") {
        case "Contact": {
          return getContactById(client, objectId as never);
        }
        case "Deal": {
          if (objectView === "single") {
            return getDealById(client, objectId as never);
          } else {
            return getDealsByContactId(client, objectId as never);
          }
        }
      }
    },
    {
      enabled: !!objectName && !!objectId,
    }
  );

  const productsByDealIdQuery = useQueryWithClient(
    ["getProducts", objectQuery.isSuccess as unknown as string],
    (client) =>
      getProductsByDealId(
        client,
        (objectQuery.data?.result as IDeal).ID as string
      ),
    {
      enabled:
        objectName === "Deal" &&
        objectView === "single" &&
        objectQuery.isSuccess,
    }
  );

  const activitiesQuery = useQueryWithClient(
    [
      "getActivities",
      objectQuery.isSuccess as unknown as string,
      objectName as string,
    ],
    (client) =>
      objectName === "Deal"
        ? getActivitiesTasksByDealId(
            client,
            (objectQuery.data?.result as IContact).ID as string
          )
        : getActivitiesTasksByContactId(
            client,
            (objectQuery.data?.result as IDeal).ID as string
          ),
    {
      enabled: objectQuery.isSuccess && objectView === "single",
    }
  );

  useInitialisedDeskproAppClient(
    (client) => {
      if (!objectQuery.isSuccess || !objectName) return;

      if (objectView === "list") {
        client.setTitle(
          `${correctJson?.title}s ${makeFirstLetterUppercase(objectView)}`
        );

        if (objectName === "Deal") {
          client.registerElement("plusButton", {
            type: "plus_button",
          });
        }
        client.deregisterElement("menuButton");

        return;
      }

      client.deregisterElement("plusButton");

      client.registerElement("editButton", {
        type: "edit_button",
      });

      client.deregisterElement("menuButton");

      if (objectName === "Contact") {
        client.setTitle((objectQuery.data?.result as IContact).NAME);

        return;
      }

      client.setTitle((objectQuery.data.result as IDeal).TITLE);
    },
    [objectQuery.isSuccess, objectView, objectName]
  );

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");

          break;

        case "editButton":
          navigate(`/edit/${objectName}/${objectId}`);

          break;

        case "plusButton":
          navigate(`/create/${objectName}`);

          break;
      }
    },
  });

  const object = useMemo(() => {
    if (!objectQuery.data) return;

    if (objectView === "single" && objectName !== "Deal")
      return [objectQuery.data?.result];

    if (objectView === "list") return objectQuery.data?.result as IDeal[];

    if (!productsByDealIdQuery.data) return;

    return [
      {
        ...objectQuery.data.result,
        PRODUCTS: productsByDealIdQuery.data.result ?? [],
      },
    ];
  }, [objectName, objectQuery.data, objectView, productsByDealIdQuery.data]);

  const activities = useMemo(
    () =>
      activitiesQuery.data?.result.filter(
        (e) => e.PROVIDER_TYPE_ID !== "TASKS_TASK"
      ) ?? [],
    [activitiesQuery.data?.result]
  );

  const tasks = useMemo(
    () =>
      activitiesQuery.data?.result.filter(
        (e) => e.PROVIDER_TYPE_ID === "TASKS_TASK"
      ) ?? [],
    [activitiesQuery.data?.result]
  );

  if (!objectView || (objectView !== "list" && objectView !== "single"))
    return <H2>Please use a accepted Object View</H2>;

  if (
    objectName !== "Contact" &&
    objectName !== "Deal" &&
    objectName !== "Bill" &&
    objectName !== "PurchaseOrder"
  )
    return <H2>Please use an accepted Object</H2>;
  if (!object || !correctJson || !activitiesQuery.isSuccess) {
    return <LoadingSpinnerCenter />;
  }

  return (
    <Stack style={{ width: "100%", padding: "8px" }} vertical gap={10}>
      <FieldMapping
        fields={object}
        metadata={correctJson[objectView]}
        childTitleAccessor={
          objectView === "list" ? (e) => getTitle(e, objectName) : undefined
        }
        idKey={correctJson.idKey}
        externalChildUrl={
          objectView === "single" ? undefined : correctJson.externalChildUrl
        }
        internalChildUrl={
          objectView === "single" ? undefined : correctJson.internalChildUrl
        }
      />
      {objectView === "single" && (
        <>
          <FieldMapping
            fields={activities}
            metadata={activityJson.list}
            title={`Activities (${activities?.length})`}
            childTitleAccessor={(e) => e.SUBJECT}
            createPage={`/create/Activity?activity_type=Activity&owner_type_id=${entity_type_id}&owner_id=${objectId}`}
          />
          <FieldMapping
            fields={tasks}
            metadata={activityJson.list}
            title={`Tasks (${tasks?.length})`}
            childTitleAccessor={(e) => e.SUBJECT}
            // createPage={`/create/Activity?activity_type=Task&owner_type_id=${entity_type_id}&owner_id=${objectId}`}
          />
        </>
      )}
    </Stack>
  );
};
