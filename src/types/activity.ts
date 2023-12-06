/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IActivity {
  ID: string;
  OWNER_ID: string;
  OWNER_TYPE_ID: string;
  TYPE_ID: string;
  PROVIDER_ID: string;
  PROVIDER_TYPE_ID: string;
  PROVIDER_GROUP_ID: null;
  ASSOCIATED_ENTITY_ID: string;
  SUBJECT: string;
  CREATED: string;
  LAST_UPDATED: string;
  START_TIME: string;
  END_TIME: string;
  DEADLINE: string;
  COMPLETED: string;
  STATUS: string;
  RESPONSIBLE_ID: string;
  PRIORITY: string;
  NOTIFY_TYPE: string;
  NOTIFY_VALUE: string;
  DESCRIPTION: string;
  DESCRIPTION_TYPE: string;
  DIRECTION: string;
  LOCATION: null;
  SETTINGS: any[];
  ORIGINATOR_ID: null;
  ORIGIN_ID: null;
  AUTHOR_ID: string;
  EDITOR_ID: string;
  PROVIDER_PARAMS: any[];
  PROVIDER_DATA: null;
  RESULT_MARK: string;
  RESULT_VALUE: null;
  RESULT_SUM: null;
  RESULT_CURRENCY_ID: null;
  RESULT_STATUS: string;
  RESULT_STREAM: string;
  RESULT_SOURCE_ID: null;
  AUTOCOMPLETE_RULE: string;
}

export interface ICreateActivity {
  ownerTypeId: string;
  ownerId: string;
  description: string;
  responsibleId: string;
  deadline: Date;
}
