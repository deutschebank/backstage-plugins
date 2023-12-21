# Taxonomy

- Taxonomy in broader / general sense is a hierarchical grouping of things etc.,
- The Taxonomy plugin is a frontend, backend, and a client package that provides capability for users to view the catalog items classified against one or more associated taxonomies.

# Taxonomy Backend

Welcome to the taxonomy backend plugin for backstage.

## Setup

Add the plugin to your backend app:

```bash
cd packages/backend && yarn add @deutschebank/backstage-plugin-taxonomy-backend
```

Create a file in `packages/backend/src/plugins/taxonomy.ts`:

```ts
import { createRouter } from '@deutschebank/backstage-plugin-taxonomy-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

In `packages/backend/src/index.ts` add the following:

```ts
import taxonomy from './plugins/taxonomy';

// ...
async function main() {
  // ...
  const taxonomyEnv = useHotMemoize(module, () => createEnv('taxonomy'));

  const apiRouter = Router();
  apiRouter.use('/taxonomy', await taxonomy(taxonomyEnv));
  // ...
}
```

## Taxonomy Data Structure

The implementation expects the taxonomy data in the following hierarchy. 

[Sample Data](./src/data/AssetData.js)

## Taxonomy reference in Entity yaml definition

The backstage entity yaml definition needs reference/s to the taxonomy so that it gets filtered on the right selection of the taxonomy element and for the right taxonomy type.

Following is an example of how the entity metadata yaml looks like for a taxonomy type 'assetTaxonomy'

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: TEST
  description: TEST
  taxonomies:
    assetTaxonomy:
      - AT0001
	  - AT0012
	  - AT0022
spec:
  type: TEST
  lifecycle: TEST
  owner: TEST
```