Bitrix24 App Setup
===

To install the Bitrix24 app, you need to retrieve authentication credentials using either a REST API URL or OAuth. Follow the steps below for your preferred method.


## Using A REST API URL

Head over to your Bitrix24 homepage and, on the left panel, click Developer Resources -> Automate Sales -> Move a deal along a sales tunnel.

[![](/docs/assets/setup/left_panel.png)](/docs/assets/setup/left_panel.png)

Now Assign the "Users" Permission at the bottom under "Assign permissions", save, copy "Webhook to call REST API", and paste it on the settings section of the app installation page, on the "Rest API URL" field.

[![](/docs/assets/setup/webhook_api.png)](/docs/assets/setup/webhook_api.png)

[![](/docs/assets/setup/perms.png)](/docs/assets/setup/perms.png)

After this, copy your page URL and paste it under the "Main URL" field in the settings section. If done correctly your settings page should look like this:

[![](/docs/assets/setup/settings.png)](/docs/assets/setup/settings.png)

After this is done, click install and the installation process is completed!


## Using OAuth

Head over to `https://<your-instance-url>/devops/section/standard/` (e.g. https://johndoe.bitrix24.uk/devops/section/standard/) and click the "Local application" button.

[![](/docs/assets/setup/bitrix24-setup-oauth-01.png)](/docs/assets/setup/bitrix24-setup-oauth-01.png)

You'll be prompted with a form to enter details about your app. In the "Your handler path" field, enter the Callback URL provided in the settings drawer in Deskpro. In the "Menu item text English (en)*" field, enter the name of your app (something like "Deskpro App" will work fine.)

[![](/docs/assets/setup/bitrix24-setup-oauth-02.png)](/docs/assets/setup/bitrix24-setup-oauth-02.png)


Next, assign the `CRM` and `Users` permissions at the bottom of the form under "Assign permissions", then click to proceed.

 [![](/docs/assets/setup/bitrix24-setup-oauth-03.png)](/docs/assets/setup/bitrix24-setup-oauth-03.png)


You'll be presented with your `client_id` and `client_secret`. Copy these values and paste them into the settings drawer in Deskpro.

  [![](/docs/assets/setup/bitrix24-setup-oauth-04.png)](/docs/assets/setup/bitrix24-setup-oauth-04.png)

To see a list of your apps, visit: `https://<your-instance-url>/devops/list/`.

To configure who can access the app, go to the **Permissions** tab and select the users and/or groups that should have access. Once you're satisfied with the settings, click **"Install"** to complete the setup.
