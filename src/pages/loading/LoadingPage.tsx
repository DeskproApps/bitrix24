import { ContextData, ISettings } from "../../types/settings";
import { FC, useState } from "react"
import { getCurrentUser } from "../../api/api";
import { LoadingSpinner, useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Stack } from "@deskpro/deskpro-ui";
import { useLinkContact } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import StyledErrorBlock from "../../components/StyledErrorBlock";

const LoadingPage: FC = () => {
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<ContextData, ISettings>()
  const { getLinkedContact } = useLinkContact();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)

  const navigate = useNavigate()

  // Determine authentication method from settings
  const isUsingOAuth = context?.settings?.use_rest_api_url === false || context?.settings.use_advanced_connect === false
  const user = context?.data?.user

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements()
    registerElement("refreshButton", { type: "refresh_button" })
  });

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Bitrix24")

    if (!context?.settings || !user) {
      return
    }

    // Store the authentication method in the user state
    client.setUserState("isUsingOAuth", isUsingOAuth)

    // Verify authentication status
    // If OAuth2 mode and the user is logged in the request would be make with their stored access token
    // If in REST API URL mode the request would be made with the URL/token provided in the app setup
    getCurrentUser(client)
      .then((activeUser) => {
        if (activeUser) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => { })
      .finally(() => {
        setIsFetchingAuth(false)
      })
  }, [context, context?.settings])


  if (!client || isFetchingAuth || !user) {
    return (<LoadingSpinner />)
  }

  if (isAuthenticated) {

    getLinkedContact()
      .then((linkedContact) => {
        if (!linkedContact || linkedContact.length === 0) {
          navigate("/findOrCreate")
        } else {
          navigate("/home")
        }
      })
  } else {

    if (isUsingOAuth) {
      navigate("/login")
    } else {
      // Show error for invalid REST URLs (expired or not present)
      return (
        <Stack padding={12}>
          <StyledErrorBlock>Invalid REST API URL</StyledErrorBlock>
        </Stack>
      )
    }
  }

  return (<LoadingSpinner />);
}

export default LoadingPage