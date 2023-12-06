import { useParams } from "react-router-dom";
import { MutateObject } from "../../components/Mutate/Object";
import { H1, Stack } from "@deskpro/deskpro-ui";

export const EditObject = () => {
  const { objectName, objectId } = useParams<{
    objectName: "Deal" | "Contact";
    objectId: string;
  }>();

  if (!objectName || !objectId)
    return <H1>Object Name and Object Id must be specified</H1>;

  return (
    <Stack style={{ padding: "8px" }}>
      <MutateObject objectId={objectId} objectName={objectName} />
    </Stack>
  );
};
