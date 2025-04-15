export interface ISettings {
  client_id?: string;
  use_advanced_connect?: boolean,
  use_rest_api_url?: boolean
}

export type DeskproUser = {
  emails: string[],
  firstName: string,
  id: string,
  isAgent: boolean,
  isConfirmed: boolean,
  isDisabled: boolean,
  lastName: string,
  name: string,
  primaryEmail: string,
  titlePrefix: string,
  phoneNumbers?: {
      ext: string,
      guessedType: string,
      id: string
      label: string,
      number: string,
  }[],
};

export type ContextData = {
  user: DeskproUser,
};
