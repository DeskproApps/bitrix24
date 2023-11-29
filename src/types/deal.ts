/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProductRow } from "./product";

export interface IDeal {
  ID: string;
  TITLE: string;
  TYPE_ID: string;
  STAGE_ID: string;
  PROBABILITY: any;
  CURRENCY_ID: string;
  OPPORTUNITY: string;
  IS_MANUAL_OPPORTUNITY: string;
  TAX_VALUE: string;
  LEAD_ID: any;
  COMPANY_ID: string;
  CONTACT_ID: string;
  QUOTE_ID: any;
  BEGINDATE: string;
  CLOSEDATE: string;
  ASSIGNED_BY_ID: string;
  CREATED_BY_ID: string;
  MODIFY_BY_ID: string;
  DATE_CREATE: string;
  DATE_MODIFY: string;
  OPENED: string;
  CLOSED: string;
  COMMENTS: string;
  ADDITIONAL_INFO: any;
  LOCATION_ID: any;
  CATEGORY_ID: string;
  STAGE_SEMANTIC_ID: string;
  IS_NEW: string;
  IS_RECURRING: string;
  IS_RETURN_CUSTOMER: string;
  IS_REPEATED_APPROACH: string;
  SOURCE_ID: string;
  SOURCE_DESCRIPTION: string;
  ORIGINATOR_ID: any;
  ORIGIN_ID: any;
  MOVED_BY_ID: string;
  MOVED_TIME: string;
  LAST_ACTIVITY_TIME: string;
  UTM_SOURCE: any;
  UTM_MEDIUM: any;
  UTM_CAMPAIGN: any;
  UTM_CONTENT: any;
  UTM_TERM: any;
  LAST_ACTIVITY_BY: string;
}

export type IDealCreate = IDeal & { PRODUCTS: Partial<IProductRow>[] };
