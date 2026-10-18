import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ky8bcwum',
    dataset: 'production',
  },
  deployment: {
    appId: 'a8wr3r6mawllmr1a6i2h8k5e',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
