import { IActivity } from "../types/activity";
import { IContact, IContactList } from "../types/contact";
import { IDeal, IDealCreate } from "../types/deal";
import { IProduct, IProductRow } from "../types/product";
import { placeholders } from "../constants";
import { RequestMethod } from "./types";
import {IDeskproClient,proxyFetch} from "@deskpro/app-sdk";

export const getCurrentUser = async (
  client: IDeskproClient
): Promise<{ result: { ID: number; NAME: string } }> =>
  installedRequest(client, "user.current.json", "GET");

export const createProductRowsByDealId = async (
  client: IDeskproClient,
  id: number | string,
  rows: IProductRow[]
): Promise<{ result: IProductRow[] }> =>
  installedRequest(client, `crm.deal.productrows.set`, "POST", { id, rows });

export const getProductsByDealId = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IProductRow[] }> =>
  installedRequest(client, `crm.deal.productrows.get?id=${id}`, "GET");

export const getProducts = async (
  client: IDeskproClient
): Promise<{ result: IProduct[] }> =>
  installedRequest(client, "crm.product.list.json", "GET");

//OWNER_TYPE_ID - 2 = deal, 3 = contact

export const createActivity = async (
  client: IDeskproClient,
  query: string
): Promise<{ result: IActivity }> =>
  installedRequest(client, `crm.activity.todo.add?${query}`, "POST");

export const getActivitiesTasksByDealId = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IActivity[] }> =>
  installedRequest(
    client,
    `crm.activity.list.json?filter[OWNER_ID]=${id}&filter[OWNER_TYPE_ID]=2`,
    "GET"
  );

export const getActivitiesTasksByContactId = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IActivity[] }> =>
  installedRequest(
    client,
    `crm.activity.list.json?filter[OWNER_ID]=${id}&filter[OWNER_TYPE_ID]=3`,
    "GET"
  );

export const getDealsByContactId = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IDeal[] }> =>
  installedRequest(
    client,
    `crm.deal.list.json?filter[CONTACT_ID]=${id}`,
    "GET"
  );

export const createDeal = async (
  client: IDeskproClient,
  data: IDealCreate
): Promise<{ result: IDeal }> => {
  const dealNoProducts = {
    ...data,
    PRODUCTS: undefined,
  };

  const dealCreateRes = await installedRequest(
    client,
    "crm.deal.add.json",
    "POST",
    { fields: dealNoProducts }
  );

  await createProductRowsByDealId(
    client,
    dealCreateRes.result,
    data.PRODUCTS as IProductRow[]
  );

  return dealCreateRes;
};

export const editDeal = async (
  client: IDeskproClient,
  id: number | string,
  data: IDealCreate
): Promise<{ result: IDeal }> => {
  const dealNoProducts = {
    ...data,
    PRODUCTS: undefined,
  };
  const editDealReq = await installedRequest(
    client,
    `crm.deal.update.json?id=${id}`,
    "POST",
    { fields: dealNoProducts }
  );

  await createProductRowsByDealId(
    client,
    editDealReq.result,
    data.PRODUCTS as IProductRow[]
  );

  return editDealReq;
};

export const getDealById = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IDeal }> =>
  installedRequest(client, `crm.deal.get.json?id=${id}`, "GET");

export const createContact = async (
  client: IDeskproClient,
  data: IContact
): Promise<{ result: IContact }> =>
  installedRequest(client, "crm.contact.add.json", "POST", { fields: data });

export const getContacts = async (
  client: IDeskproClient
): Promise<{ result: IContactList[] }> =>
  installedRequest(client, "crm.contact.list.json", "GET");

export const getContactById = async (
  client: IDeskproClient,
  id: number | string
): Promise<{ result: IContact }> =>
  installedRequest(client, `crm.contact.get.json?id=${id}`, "GET");

export const getContactsByEmail = async (
  client: IDeskproClient,
  email: string
): Promise<{ result: IContactList[] }> =>
  installedRequest(
    client,
    `crm.contact.list.json?filter[EMAIL]=${email}`,
    "GET"
  );

export const editContact = async (
  client: IDeskproClient,
  id: number | string,
  data: IContact
): Promise<{ result: IContact }> =>
  installedRequest(client, `crm.contact.update.json?id=${id}`, "POST", {
    fields: data,
  });

const installedRequest = async (
  client: IDeskproClient,
  endpoint: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const isUsingOAuth2 = (await client.getUserState<boolean>("isUsingOAuth"))[0]?.data

  const oauthAccessToken = `[user[${placeholders.OAUTH2_ACCESS_TOKEN_PATH}]]`;
  const baseURL = isUsingOAuth2 ? `__main_url__/rest/${endpoint}` : `__rest_api_url__${endpoint}`;
  const fetchURL = isUsingOAuth2
    ? `${baseURL}${endpoint.includes('?') ? '&' : '?'}auth=${oauthAccessToken}`
    : baseURL;

  const response = await fetch(fetchURL, options);

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  const json = await response.json();

  if (json.error_description) {
    throw new Error(json.error_description);
  }

  return json;
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
