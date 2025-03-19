import { AnyIcon, Button, Checkbox, Input, Stack } from "@deskpro/deskpro-ui";
import { ChangeEvent, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FieldMapping } from "../FieldMapping/FieldMapping";
import { getContactsByEmail } from "../../api/api";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";
import { Title } from "../../styles";
import { useInitialisedDeskproAppClient, useQueryWithClient } from "@deskpro/app-sdk";
import { useLinkContact } from "../../hooks/hooks";
import ContactJson from "../../mapping/contact.json";
import useDebounce from "../../hooks/debounce";

export const LinkContact = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const { linkContact } = useLinkContact();

  const { debouncedValue: debouncedText } = useDebounce(prompt, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Link Contact");
  }, []);

  const contactsQuery = useQueryWithClient(
    ["getContactsByEmail", debouncedText],
    (client) => getContactsByEmail(client, debouncedText),
    {
      enabled: debouncedText.length > 2,
    }
  );

  const contacts = contactsQuery.data?.result;

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Stack vertical gap={6} style={{ width: "100%" }}>
        <Input
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter Email Address"
          type="text"
          leftIcon={faMagnifyingGlass as AnyIcon}
        />
        <Stack vertical style={{ width: "100%" }} gap={5}>
          <Stack
            style={{ width: "100%", justifyContent: "space-between" }}
            gap={5}
          >
            <Button
              onClick={() => selectedContact && linkContact(selectedContact)}
              disabled={selectedContact == null}
              text="Link Contact"
            ></Button>
            <Button
              disabled={selectedContact == null}
              text="Cancel"
              intent="secondary"
              onClick={() => setSelectedContact(null)}
            ></Button>
          </Stack>
          <HorizontalDivider full />
        </Stack>
        {contactsQuery.isFetching ? (
          <LoadingSpinnerCenter />
        ) : contactsQuery.isSuccess && contacts?.length !== 0 ? (
          <Stack vertical gap={5} style={{ width: "100%" }}>
            {contacts?.map((contact, i) => {
              return (
                <Stack key={i} gap={6} style={{ width: "100%" }}>
                  <Stack style={{ marginTop: "2px" }}>
                    <Checkbox
                      checked={selectedContact === contact.ID}
                      onChange={() => {
                        if (selectedContact == null) {
                          setSelectedContact(contact.ID);
                        } else {
                          setSelectedContact(null);
                        }
                      }}
                    ></Checkbox>
                  </Stack>
                  <Stack style={{ width: "92%" }}>
                    <FieldMapping
                      fields={[contact]}
                      hasCheckbox={true}
                      metadata={ContactJson.list}
                      idKey={ContactJson.idKey}
                      externalChildUrl={ContactJson.externalUrl}
                      childTitleAccessor={(e) => e.NAME}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          contactsQuery.isSuccess && <Title>No Contacts Found.</Title>
        )}
      </Stack>
    </Stack>
  );
};
