import { useParams } from "react-router-dom";
import { MutateObject } from "../../components/Mutate/Object";
import { Stack } from "@deskpro/deskpro-ui";

export const CreateObject = () => {
  const { objectName } = useParams();

  return (
    <Stack style={{ padding: "8px" }}>
      <MutateObject objectName={objectName as "Contact" | "Deal"} />
    </Stack>
  );
};
