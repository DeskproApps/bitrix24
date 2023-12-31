/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IContact {
  ID: string;
  POST: string;
  COMMENTS: string;
  HONORIFIC: string;
  NAME: string;
  SECOND_NAME: string;
  LAST_NAME: string;
  PHOTO: null;
  LEAD_ID: null;
  TYPE_ID: string;
  SOURCE_ID: string;
  SOURCE_DESCRIPTION: string;
  COMPANY_ID: null;
  BIRTHDATE: string;
  EXPORT: string;
  HAS_PHONE: string;
  HAS_EMAIL: string;
  HAS_IMOL: string;
  DATE_CREATE: string;
  DATE_MODIFY: string;
  ASSIGNED_BY_ID: string;
  CREATED_BY_ID: string;
  MODIFY_BY_ID: string;
  OPENED: string;
  ORIGINATOR_ID: null;
  ORIGIN_ID: null;
  ORIGIN_VERSION: null;
  FACE_ID: null;
  LAST_ACTIVITY_TIME: string;
  ADDRESS: null;
  ADDRESS_2: null;
  ADDRESS_CITY: null;
  ADDRESS_POSTAL_CODE: null;
  ADDRESS_REGION: null;
  ADDRESS_PROVINCE: null;
  ADDRESS_COUNTRY: null;
  ADDRESS_LOC_ADDR_ID: null;
  UTM_SOURCE: null;
  UTM_MEDIUM: null;
  UTM_CAMPAIGN: null;
  UTM_CONTENT: null;
  UTM_TERM: null;
  LAST_ACTIVITY_BY: string;
  PHONE: Value[];
  EMAIL: Value[];
  WEB: Value[];
  IM: Value[];
}

export interface Value {
  ID: string;
  VALUE_TYPE: string;
  VALUE: string;
  TYPE_ID: string;
}

export interface IContactList {
  ID: string;
  POST: string;
  COMMENTS: string;
  HONORIFIC: string;
  NAME: string;
  SECOND_NAME: string;
  LAST_NAME: string;
  PHOTO: any;
  LEAD_ID: any;
  TYPE_ID: string;
  SOURCE_ID: string;
  SOURCE_DESCRIPTION: string;
  COMPANY_ID: any;
  BIRTHDATE: string;
  EXPORT: string;
  HAS_PHONE: string;
  HAS_EMAIL: string;
  HAS_IMOL: string;
  DATE_CREATE: string;
  DATE_MODIFY: string;
  ASSIGNED_BY_ID: string;
  CREATED_BY_ID: string;
  MODIFY_BY_ID: string;
  OPENED: string;
  ORIGINATOR_ID: any;
  ORIGIN_ID: any;
  ORIGIN_VERSION: any;
  FACE_ID: any;
  LAST_ACTIVITY_TIME: string;
  ADDRESS: any;
  ADDRESS_2: any;
  ADDRESS_CITY: any;
  ADDRESS_POSTAL_CODE: any;
  ADDRESS_REGION: any;
  ADDRESS_PROVINCE: any;
  ADDRESS_COUNTRY: any;
  ADDRESS_LOC_ADDR_ID: any;
  UTM_SOURCE: any;
  UTM_MEDIUM: any;
  UTM_CAMPAIGN: any;
  UTM_CONTENT: any;
  UTM_TERM: any;
  LAST_ACTIVITY_BY: string;
}
