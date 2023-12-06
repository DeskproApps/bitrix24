import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/api", () => {
  return {
    getContactById: () => ({
      result: {
        ID: "1",
        POST: "",
        COMMENTS: "",
        HONORIFIC: "HNR_EN_1",
        NAME: "David",
        SECOND_NAME: "Pinto",
        LAST_NAME: "Pinto",
        PHOTO: null,
        LEAD_ID: null,
        TYPE_ID: "CLIENT",
        SOURCE_ID: "CALL",
        SOURCE_DESCRIPTION: "",
        COMPANY_ID: null,
        BIRTHDATE: "",
        EXPORT: "Y",
        HAS_PHONE: "Y",
        HAS_EMAIL: "Y",
        HAS_IMOL: "N",
        DATE_CREATE: "2023-11-20T20:02:12+03:00",
        DATE_MODIFY: "2023-11-21T19:45:31+03:00",
        ASSIGNED_BY_ID: "1",
        CREATED_BY_ID: "1",
        MODIFY_BY_ID: "1",
        OPENED: "Y",
        ORIGINATOR_ID: null,
        ORIGIN_ID: null,
        ORIGIN_VERSION: null,
        FACE_ID: null,
        LAST_ACTIVITY_TIME: "2023-11-20T20:02:12+03:00",
        ADDRESS: null,
        ADDRESS_2: null,
        ADDRESS_CITY: null,
        ADDRESS_POSTAL_CODE: null,
        ADDRESS_REGION: null,
        ADDRESS_PROVINCE: null,
        ADDRESS_COUNTRY: null,
        ADDRESS_LOC_ADDR_ID: null,
        UTM_SOURCE: null,
        UTM_MEDIUM: null,
        UTM_CAMPAIGN: null,
        UTM_CONTENT: null,
        UTM_TERM: null,
        LAST_ACTIVITY_BY: "1",
        PHONE: [
          {
            ID: "1",
            VALUE_TYPE: "WORK",
            VALUE: "+351934575689",
            TYPE_ID: "PHONE",
          },
        ],
        EMAIL: [
          {
            ID: "3",
            VALUE_TYPE: "WORK",
            VALUE: "david.pinto@deskpro.com",
            TYPE_ID: "EMAIL",
          },
        ],
        WEB: [
          {
            ID: "5",
            VALUE_TYPE: "WORK",
            VALUE: "https://b24-vl75ta.bitrix24.eu/crm/contact/details/0/",
            TYPE_ID: "WEB",
          },
        ],
        IM: [
          {
            ID: "7",
            VALUE_TYPE: "FACEBOOK",
            VALUE: "https://b24-vl75ta.bitrix24.eu/crm/contact/details/0/",
            TYPE_ID: "IM",
          },
        ],
      },
    }),
    getDealsByContactId: () => ({
      result: [
        {
          ID: "1",
          TITLE: "Epic Deal Custom Super Max 5",
          TYPE_ID: "SALE",
          STAGE_ID: "NEW",
          PROBABILITY: null,
          CURRENCY_ID: "EUR",
          OPPORTUNITY: "2780.00",
          IS_MANUAL_OPPORTUNITY: "N",
          TAX_VALUE: "0.00",
          LEAD_ID: null,
          COMPANY_ID: "0",
          CONTACT_ID: "1",
          QUOTE_ID: null,
          BEGINDATE: "2023-11-20T03:00:00+03:00",
          CLOSEDATE: "2024-11-14T03:00:00+03:00",
          ASSIGNED_BY_ID: "1",
          CREATED_BY_ID: "1",
          MODIFY_BY_ID: "1",
          DATE_CREATE: "2023-11-20T20:03:51+03:00",
          DATE_MODIFY: "2023-11-21T21:02:02+03:00",
          OPENED: "Y",
          CLOSED: "N",
          COMMENTS: "",
          ADDITIONAL_INFO: null,
          LOCATION_ID: null,
          CATEGORY_ID: "0",
          STAGE_SEMANTIC_ID: "P",
          IS_NEW: "Y",
          IS_RECURRING: "N",
          IS_RETURN_CUSTOMER: "N",
          IS_REPEATED_APPROACH: "N",
          SOURCE_ID: "EMAIL",
          SOURCE_DESCRIPTION: "source information",
          ORIGINATOR_ID: null,
          ORIGIN_ID: null,
          MOVED_BY_ID: "1",
          MOVED_TIME: "2023-11-20T20:03:51+03:00",
          LAST_ACTIVITY_TIME: "2023-11-20T20:03:51+03:00",
          UTM_SOURCE: null,
          UTM_MEDIUM: null,
          UTM_CAMPAIGN: null,
          UTM_CONTENT: null,
          UTM_TERM: null,
          LAST_ACTIVITY_BY: "1",
        },
      ],
    }),
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const email = await waitFor(() => getByText(/david.pinto@deskpro.com/i));

    const price = await waitFor(() => getByText(/2780.00 EUR/i));

    await waitFor(() => {
      [email, price].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
