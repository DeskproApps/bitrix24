import { ContextData, ISettings } from "../../types/settings";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/api";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { placeholders } from "../../constants";
import { useCallback, useState } from "react";
import { useLinkContact } from "../../hooks/hooks";
import getAccessToken from "../../api/bitrix24/getAccessToken";

interface UseLogin {
    onSignIn: () => void,
    authUrl: string | null,
    error: null | string,
    isLoading: boolean,
};

export default function useLogin(): UseLogin {
    const [authUrl, setAuthUrl] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isPolling, setIsPolling] = useState(false)
    const [oAuth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)
    const navigate = useNavigate()

    const { getLinkedContact } = useLinkContact();

    const { context } = useDeskproLatestAppContext<ContextData, ISettings>()

    const user = context?.data?.user
    const isUsingOAuth = context?.settings?.use_rest_api_url === false || context?.settings.use_advanced_connect === false

    // TODO: Update useInitialisedDeskproAppClient typing in the
    // App SDK to to properly handle both async and sync functions

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async (client) => {
        if (!user) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (!isUsingOAuth) {
            setError("Enable OAuth to access this page");
            return
        }

        const mode = context?.settings.use_advanced_connect === false ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && (typeof clientId !== 'string' || clientId.trim() === "")) {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        const oAuth2Response = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://oauth.bitrix.info/oauth/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["redirect_uri", callbackUrl],
                        ["scope", "crm,user"],
                        ["state", state],
                    ]).toString()}`;
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oAuth2Response.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, { code, callbackURL: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("app.67d049a2edef53.72718877");

        setAuthUrl(oAuth2Response.authorizationUrl)
        setOAuth2Context(oAuth2Response)

    }, [setAuthUrl, context?.settings.use_advanced_connect, context?.settings.use_rest_api_url])


    useInitialisedDeskproAppClient((client) => {
        if (!user || !oAuth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oAuth2Context.poll()

                await client.setUserState(placeholders.OAUTH2_ACCESS_TOKEN_PATH, result.data.access_token, { backend: true })

                if (result.data.refresh_token) {
                    await client.setUserState(placeholders.OAUTH2_REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true })
                }

                try {
                    await getCurrentUser(client)
                } catch {
                    throw new Error("Error authenticating user")
                }

                getLinkedContact()
                    .then((linkedContact) => {
                        if (!linkedContact || linkedContact.length === 0) {
                            navigate("/findOrCreate")
                        } else {
                            navigate("/home")
                        }
                    })
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, user, oAuth2Context, navigate])


    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}