/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Select,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { Button, H1, H5, Stack } from "@deskpro/deskpro-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ZodTypeAny } from "zod";
import {
  createActivity,
  createContact,
  createDeal,
  editContact,
  editDeal,
  getContactById,
  getCurrentUser,
  getDealById,
  getProducts,
  getProductsByDealId,
} from "../../api/api";
import { useLinkContact } from "../../hooks/hooks";

import ContactJson from "../../mapping/contact.json";
import DealJson from "../../mapping/deal.json";
import ActivityJson from "../../mapping/activity.json";

import {
  getActivitySchema,
  getContactSchema,
  getDealSchema,
} from "../../schemas";
import { IContact } from "../../types/contact";
import { IJson } from "../../types/json";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";
import { parseJsonErrorMessage } from "../../utils/utils";
import { InputWithTitleRegister } from "../InputWithTitle/InputWithTitleRegister";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { IDeal, IDealCreate } from "../../types/deal";
import { useQueryMutationWithClient } from "../../hooks/useQueryMutationClient";
import { ICreateActivity } from "../../types/activity";

const contactInputs = ContactJson;

const dealInputs = DealJson;

type Props = {
  objectId?: string;
  objectName: "Deal" | "Contact" | "Activity";
};

export const MutateObject = ({ objectId, objectName }: Props) => {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);
  const { linkContact } = useLinkContact();
  const { context } = useDeskproLatestAppContext();

  const { getLinkedContact } = useLinkContact();

  const [owner_id, owner_type_id, activity_type] = useMemo(() => {
    const searchParams = new URLSearchParams(
      document.location.hash?.split("?")[1]
    );

    return [
      searchParams.get("owner_id"),
      searchParams.get("owner_type_id"),
      searchParams.get("activity_type"),
    ];
  }, []);

  const correctJson = useMemo<IJson>(() => {
    switch (objectName) {
      case "Contact":
        return contactInputs;
      case "Deal":
        return dealInputs;
      case "Activity":
        return ActivityJson;
    }
  }, [objectName]);

  const isEditMode = !!objectId;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<Partial<IDealCreate | IContact | ICreateActivity>>({
    resolver: zodResolver(schema as ZodTypeAny),
  });

  const products = watch("PRODUCTS");

  const contactByIdQuery = useQueryWithClient(
    ["contactQuery", objectId as string],
    (client) => getContactById(client, objectId as string),
    {
      enabled: isEditMode && objectName === "Contact",
    }
  );

  const dealByIdQuery = useQueryWithClient(
    ["dealQuery", objectId as string],
    (client) => getDealById(client, objectId as string),
    {
      enabled: isEditMode && objectName === "Deal",
    }
  );

  useQueryWithClient(
    ["getProducts", dealByIdQuery.isSuccess as unknown as string],
    (client) =>
      getProductsByDealId(
        client,
        (dealByIdQuery.data?.result as IDeal).ID as string
      ),
    {
      enabled: dealByIdQuery.isSuccess,
      onSuccess: (data) => {
        setValue("PRODUCTS", data?.result);
      },
    }
  );

  const productsQuery = useQueryWithClient(
    ["productsQuery"],
    (client) => getProducts(client),
    {
      enabled: objectName === "Deal",
    }
  );

  const currentUserQuery = useQueryWithClient(
    ["currentUserQuery"],
    (client) => getCurrentUser(client),
    {
      enabled: objectName === "Activity",
    }
  );

  const submitMutation = useQueryMutationWithClient<
    IContact | IDeal | ICreateActivity,
    { result: number }
  >(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    (client, data: any) => {
      switch (
        `${objectName}-${isEditMode}` as
          | "Contact-false"
          | "Contact-true"
          | "Deal-false"
          | "Deal-true"
          | "Activity-false"
      ) {
        case "Contact-false":
          return createContact(client, data as IContact);

        case "Activity-false":
          return createActivity(
            client,
            `ownerTypeId=${data.ownerTypeId}&ownerId=${
              data.ownerId
            }&description=${encodeURIComponent(
              data.description
            )}&responsibleId=${data.responsibleId}${
              data.deadline ? `&deadline=${data.deadline}` : ""
            }`
          );

        case "Contact-true":
          return editContact(client, objectId as string, data as IContact);

        case "Deal-false":
          return createDeal(client, data as IDealCreate);

        case "Deal-true":
          return editDeal(client, objectId as string, data as IDealCreate);
      }
    },
    {
      onError: (error) => {
        throw new Error(error as string);
      },
    }
  );

  useEffect(() => {
    if (isEditMode || objectName !== "Deal") return;

    getLinkedContact().then((e) => setValue("CONTACT_ID", e?.[0]));
  }, [getLinkedContact, isEditMode, objectName, setValue]);

  useEffect(() => {
    if (
      (objectName === "Activity" &&
        (!currentUserQuery.isSuccess || !currentUserQuery.isSuccess)) ||
      (objectName === "Contact" && !contactByIdQuery.isSuccess) ||
      (objectName === "Deal" && !dealByIdQuery.isSuccess)
    )
      return;
    const contactData = contactByIdQuery.data?.result as IContact;

    const dealData = dealByIdQuery.data?.result as IDeal;

    switch (objectName) {
      case "Contact":
        reset(contactData);
        break;

      case "Deal":
        //do something with products
        reset(dealData);
        break;

      case "Activity":
        if (activity_type === "Activity") {
          reset({
            ownerTypeId: owner_type_id ?? "1",
            ownerId: owner_id ?? "1",
            responsibleId: currentUserQuery.data?.result.ID.toString(),
          });
        } else if (activity_type === "Task") {
          reset({
            ownerTypeId: owner_type_id ?? "1",
            ownerId: owner_id ?? "1",
            responsibleId: currentUserQuery.data?.result.ID.toString(),
          });
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    objectName,
    objectId,
    contactByIdQuery.isSuccess,
    dealByIdQuery.isSuccess,
    currentUserQuery.isSuccess,
  ]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!objectName) return;

      client.deregisterElement("plusButton");

      client.setTitle(`${isEditMode ? "Edit" : "Create"} ${objectName}`);

      client.deregisterElement("editButton");
    },
    [objectName, isEditMode]
  );

  useEffect(() => {
    if (isEditMode || objectName !== "Contact" || !context) return;

    reset({
      NAME: context.data.user.name,
      EMAIL: [{ VALUE: context.data.user.primaryEmail }],
    } as IContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, objectName]);

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    if (objectName === "Activity") {
      navigate(
        `/view/single/${owner_type_id === "2" ? "Deal" : "Contact"}/${owner_id}`
      );

      return;
    }

    if (isEditMode) {
      navigate(`/view/single/${objectName}/${objectId}`);

      return;
    }

    if (objectName === "Deal") {
      navigate(`/view/single/${objectName}/${submitMutation.data.result}`);

      return;
    }

    const id = submitMutation.data?.result;

    linkContact(id.toString()).then(() => {
      navigate(`/redirect`);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    submitMutation.isSuccess,
    navigate,
    objectId,
    isEditMode,
    linkContact,
    objectName,
  ]);

  useEffect(() => {
    if (!correctJson || !objectName) return;

    if (objectName === "Deal") {
      setSchema(getDealSchema());
    } else if (objectName === "Contact") {
      setSchema(getContactSchema());
    } else if (objectName === "Activity") {
      setSchema(getActivitySchema());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, objectName]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");

          break;
      }
    },
  });

  if (
    (!contactByIdQuery.isSuccess && objectName === "Contact" && isEditMode) ||
    (!dealByIdQuery.isSuccess &&
      !dealByIdQuery.isSuccess &&
      objectName === "Deal" &&
      isEditMode) ||
    !correctJson ||
    (objectName === "Deal" && !productsQuery.data)
  )
    return <LoadingSpinnerCenter />;

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
      style={{ width: "100%" }}
    >
      <Stack vertical style={{ width: "100%" }} gap={6}>
        <FieldMappingInput
          errors={errors}
          fields={correctJson.create}
          register={register}
          setValue={setValue}
          watch={watch}
        />
        {objectName === "Deal" && (
          <>
            {products?.map((_, i) => (
              <>
                <H5 style={{ fontSize: "14px", marginTop: "2px" }}>
                  Line Item {i + 1}
                </H5>
                <Select<string>
                  options={
                    productsQuery.data?.result.map((e) => ({
                      label: e.NAME,
                      value: e.ID,
                      type: "value",
                      key: e.ID,
                    })) ?? []
                  }
                  value={watch(
                    `PRODUCTS.${i}.PRODUCT_ID` as keyof IDeal
                  ).toString()}
                  onChange={(e) =>
                    setValue(`PRODUCTS.${i}.PRODUCT_ID` as keyof IDeal, e)
                  }
                  error={!!(errors as any)[`PRODUCTS.${i}.PRODUCT_ID`]}
                />
                <InputWithTitleRegister
                  register={register(`PRODUCTS.${i}.QUANTITY`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  title="Quantity"
                  required={true}
                  error={
                    !!(errors as any)[`PRODUCTS.${i}.QUANTITY` as keyof IDeal]
                  }
                />
                <InputWithTitleRegister
                  register={register(`PRODUCTS.${i}.PRICE`, {
                    valueAsNumber: true,
                  })}
                  required={true}
                  type="number"
                  title="Unit Price"
                  error={
                    !!(errors as any)[`PRODUCTS.${i}.PRICE` as keyof IDeal]
                  }
                />
                <HorizontalDivider full />
              </>
            ))}
            <Stack justify="space-between" style={{ width: "100%" }}>
              <Button
                onClick={() =>
                  setValue(`PRODUCTS.${products?.length || 0}`, {
                    QUANTITY: 0,
                    PRICE: 0,
                    PRODUCT_ID: 0,
                  })
                }
                text="Add Line Item"
              ></Button>
              <Button
                onClick={() =>
                  setValue(
                    `PRODUCTS`,
                    (products?.length || 0) > 1 ? products?.slice(0, -1) : []
                  )
                }
                intent="secondary"
                text="Remove Line Item"
              ></Button>
            </Stack>
          </>
        )}
        <Stack style={{ width: "100%", justifyContent: "space-between" }}>
          <Button
            type="submit"
            data-testid="button-submit"
            text={objectId ? "Save" : "Create"}
            loading={submitMutation.isLoading}
            disabled={submitMutation.isLoading}
            intent="primary"
          ></Button>
          {!!objectId && (
            <Button
              text="Cancel"
              onClick={() => navigate(`/redirect`)}
              intent="secondary"
            ></Button>
          )}
        </Stack>
      </Stack>
      <H1>
        {!!submitMutation.error &&
          parseJsonErrorMessage(
            (submitMutation.error as { message: string }).message
          )}
      </H1>
    </form>
  );
};
