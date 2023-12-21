/*
 * Backstage Plugins
 * Copyright (C) 2023 Deutsche Bank AG
 * See README.md for more information
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { 
  configApiRef, 
  createApiFactory, 
  createApiRef, 
  createPlugin, 
  createRoutableExtension
} from '@backstage/core-plugin-api';
import { 
  TaxonomyApi,
  TaxonomyClient 
} from '@deutschebank/backstage-taxonomy-client';

import { rootRouteRef } from './routes';

export const taxonomyApiRef = createApiRef<TaxonomyApi>({
  id: 'taxonomy',
});

export const taxonomyPlugin = createPlugin({
  id: 'taxonomy',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: taxonomyApiRef,
      deps: {
        configApi: configApiRef
      },
      factory: ({configApi}) => TaxonomyClient.fromConfig(configApi),
    }),
  ],
});

export const TaxonomyPage = taxonomyPlugin.provide(
  createRoutableExtension({
    name: 'Taxonomy',
    component: () =>
      import('./components/TaxonomyPage').then(m => m.TaxonomyPage),
    mountPoint: rootRouteRef,
  }),
);