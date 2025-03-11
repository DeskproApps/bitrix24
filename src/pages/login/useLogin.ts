import { ContextData, ISettings } from "../../types/settings";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/api";
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
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
    const navigate = useNavigate()

    const { getLinkedContact } = useLinkContact();

    const { context } = useDeskproLatestAppContext<ContextData, ISettings>()

    const user = context?.data?.user


    // TODO: Update useInitialisedDeskproAppClient typing in the
    // App SDK to to properly handle both async and sync functions

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_deskpro_saas === undefined || !user) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (context.settings.use_rest_api_url === true) {
            setError("Enable OAuth to access this page");
            return
        }

        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        const oauth2 = mode === "local" ?
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
                    const url = new URL(oauth2.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, { code, callbackURL: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("0c24a533-90fe-4f5d-8882-ada7e3bfeed1");

        setAuthUrl(oauth2.authorizationUrl)
        setIsLoading(false)

        try {
            const result = await oauth2.poll()

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
            setIsLoading(false);
        }
    }, [setAuthUrl, context?.settings.use_deskpro_saas])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    return { authUrl, onSignIn, error, isLoading }

}