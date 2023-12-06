import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { RoundedLabelTag } from "@deskpro/deskpro-ui";
import { makeFirstLetterUppercase } from "../../utils/utils";

type Props = {
  title: string | number;
};

export const CustomTag = ({ title }: Props) => {
  let color;
  title = makeFirstLetterUppercase(title as string);
  const { theme } = useDeskproAppTheme();

  switch (title) {
    case "N": {
      color = theme?.colors?.red100;

      title = "No";

      break;
    }

    case "Y": {
      color = theme?.colors?.green100;

      title = "Yes";

      break;
    }

    default:
      color = theme?.colors?.grey100;
  }

  return (
    <RoundedLabelTag
      label={title as string}
      backgroundColor={color}
      textColor="white"
    />
  );
};
