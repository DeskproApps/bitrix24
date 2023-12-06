import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewObject } from "../../../src/pages/View/Object";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewObject />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getDealById: () => ({
      result: {
        ID: "3",
        TITLE: "Epic Deal 2",
        TYPE_ID: "SALE",
        STAGE_ID: "NEW",
        PROBABILITY: null,
        CURRENCY_ID: "EUR",
        OPPORTUNITY: "500.00",
        IS_MANUAL_OPPORTUNITY: "N",
        TAX_VALUE: "0.00",
        LEAD_ID: null,
        COMPANY_ID: "0",
        CONTACT_ID: null,
        QUOTE_ID: null,
        BEGINDATE: "2023-11-20T03:00:00+03:00",
        CLOSEDATE: "2023-11-27T03:00:00+03:00",
        ASSIGNED_BY_ID: "1",
        CREATED_BY_ID: "1",
        MODIFY_BY_ID: "1",
        DATE_CREATE: "2023-11-21T01:35:13+03:00",
        DATE_MODIFY: "2023-11-21T01:35:26+03:00",
        OPENED: "Y",
        CLOSED: "N",
        COMMENTS: null,
        ADDITIONAL_INFO: null,
        LOCATION_ID: null,
        CATEGORY_ID: "0",
        STAGE_SEMANTIC_ID: "P",
        IS_NEW: "Y",
        IS_RECURRING: "N",
        IS_RETURN_CUSTOMER: "N",
        IS_REPEATED_APPROACH: "N",
        SOURCE_ID: null,
        SOURCE_DESCRIPTION: null,
        ORIGINATOR_ID: null,
        ORIGIN_ID: null,
        MOVED_BY_ID: "1",
        MOVED_TIME: "2023-11-21T01:35:13+03:00",
        LAST_ACTIVITY_TIME: "2023-11-21T01:35:13+03:00",
        UTM_SOURCE: null,
        UTM_MEDIUM: null,
        UTM_CAMPAIGN: null,
        UTM_CONTENT: null,
        UTM_TERM: null,
        LAST_ACTIVITY_BY: "1",
      },
    }),
    getProductsByDealId: () => ({
      result: [
        {
          ID: "3",
          OWNER_ID: "3",
          OWNER_TYPE: "D",
          PRODUCT_ID: 3,
          PRODUCT_NAME: "RTX 4090",
          ORIGINAL_PRODUCT_NAME: "RTX 4080",
          PRODUCT_DESCRIPTION: null,
          PRICE: 500,
          PRICE_EXCLUSIVE: 500,
          PRICE_NETTO: 500,
          PRICE_BRUTTO: 500,
          PRICE_ACCOUNT: "500.00",
          QUANTITY: 1,
          DISCOUNT_TYPE_ID: 2,
          DISCOUNT_RATE: 0,
          DISCOUNT_SUM: 0,
          TAX_RATE: null,
          TAX_INCLUDED: "N",
          CUSTOMIZED: "Y",
          MEASURE_CODE: 796,
          MEASURE_NAME: "pcs.",
          SORT: 10,
          XML_ID: null,
          TYPE: 4,
          STORE_ID: null,
          RESERVE_ID: null,
          DATE_RESERVE_END: null,
          RESERVE_QUANTITY: null,
        },
      ],
    }),
    getActivitiesTasksByDealId: () => ({
      result: [
        {
          ID: "9",
          OWNER_ID: "3",
          OWNER_TYPE_ID: "2",
          TYPE_ID: "6",
          PROVIDER_ID: "CRM_TODO",
          PROVIDER_TYPE_ID: "TODO",
          PROVIDER_GROUP_ID: null,
          ASSOCIATED_ENTITY_ID: "0",
          SUBJECT: "Contact customer",
          CREATED: "2023-11-21T01:35:31+03:00",
          LAST_UPDATED: "2023-11-21T01:35:31+03:00",
          START_TIME: "2023-11-23T12:00:00+03:00",
          END_TIME: "2023-11-23T12:00:00+03:00",
          DEADLINE: "2023-11-23T12:00:00+03:00",
          COMPLETED: "N",
          STATUS: "1",
          RESPONSIBLE_ID: "1",
          PRIORITY: "1",
          NOTIFY_TYPE: "0",
          NOTIFY_VALUE: "0",
          DESCRIPTION: "Contact customer",
          DESCRIPTION_TYPE: "1",
          DIRECTION: "0",
          LOCATION: null,
          SETTINGS: [],
          ORIGINATOR_ID: null,
          ORIGIN_ID: null,
          AUTHOR_ID: "1",
          EDITOR_ID: "1",
          PROVIDER_PARAMS: [],
          PROVIDER_DATA: null,
          RESULT_MARK: "0",
          RESULT_VALUE: null,
          RESULT_SUM: null,
          RESULT_CURRENCY_ID: null,
          RESULT_STATUS: "0",
          RESULT_STREAM: "0",
          RESULT_SOURCE_ID: null,
          AUTOCOMPLETE_RULE: "0",
        },
      ],
    }),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({
    objectName: "Deal",
    objectId: "123",
    objectView: "single",
  }),
}));

describe("View", () => {
  test("View page should show a contact correctly", async () => {
    const { getByText } = renderPage();

    const productName = await waitFor(() => getByText(/RTX 4080/i));

    const price = await waitFor(() => getByText(/500.00 EUR/i));

    await waitFor(() => {
      [productName, price].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
