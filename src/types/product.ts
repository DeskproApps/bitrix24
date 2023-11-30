/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IProductRow {
  ID: string;
  OWNER_ID: string;
  OWNER_TYPE: string;
  PRODUCT_ID: number;
  PRODUCT_NAME: string;
  ORIGINAL_PRODUCT_NAME: string;
  PRODUCT_DESCRIPTION: null;
  PRICE: number;
  PRICE_EXCLUSIVE: number;
  PRICE_NETTO: number;
  PRICE_BRUTTO: number;
  PRICE_ACCOUNT: string;
  QUANTITY: number;
  DISCOUNT_TYPE_ID: number;
  DISCOUNT_RATE: number;
  DISCOUNT_SUM: number;
  TAX_RATE: null;
  TAX_INCLUDED: string;
  CUSTOMIZED: string;
  MEASURE_CODE: number;
  MEASURE_NAME: string;
  SORT: number;
  XML_ID: null;
  TYPE: number;
  STORE_ID: null;
  RESERVE_ID: null;
  DATE_RESERVE_END: null;
  RESERVE_QUANTITY: null;
}

export interface IProduct {
  ID: string;
  NAME: string;
  CODE: string;
  ACTIVE: string;
  PREVIEW_PICTURE: any;
  DETAIL_PICTURE: any;
  SORT: string;
  XML_ID: string;
  TIMESTAMP_X: string;
  DATE_CREATE: string;
  MODIFIED_BY: string;
  CREATED_BY: string;
  CATALOG_ID: string;
  SECTION_ID: any;
  DESCRIPTION: any;
  DESCRIPTION_TYPE: string;
  PRICE: string;
  CURRENCY_ID: string;
  VAT_ID: any;
  VAT_INCLUDED: string;
  MEASURE: string;
}
