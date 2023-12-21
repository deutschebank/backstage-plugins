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

import { errorHandler } from '@backstage/backend-common';
import express from 'express'
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { TaxonomyTypeEnum } from '@deutschebank/backstage-taxonomy-client';
import { assetClassificationData } from '../data';

export interface RouterOptions {
  logger: Logger;
  config: Config;
} 

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {

  const { logger } = options;
  
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('healthy!');
    response.send({ status: 'ok' });
  });

  router.get('/', async (_req, res) => {
    switch (`${_req.query.taxonomyType}`) {
      case TaxonomyTypeEnum.AssetTaxonomy:
        const existingUnclassifiedTaxnonomyIdAT = assetClassificationData.filter((e: any) => e.id == 0)?.[0];
        if(existingUnclassifiedTaxnonomyIdAT == undefined || existingUnclassifiedTaxnonomyIdAT == null)
          assetClassificationData.push(JSON.parse(getUnclassifiedTaxonomyNode()));
        res.send(assetClassificationData);
        return assetClassificationData; 
      default :
        const errorMessage: string = 'Invalid Taxonomy Type query param : ' + `${_req.query.taxonomyType}`;
        res.send(errorMessage);
        return errorMessage;
    }
  });
  
  router.get('/fetchTaxonomyName', async (_req, res) => {
    const externalId = _req.query.external_id;
    switch (`${_req.query.taxonomyType}`) {
      case TaxonomyTypeEnum.AssetTaxonomy:
        let atName;
        assetClassificationData.map(taxonomy => {
          if (taxonomy.external_id == externalId) {
            atName = taxonomy.name;
            res.send(taxonomy.name)
          }});
        return atName;        
      default :
        const errorMessage: string = 'Invalid Taxonomy Type query param : ' + `${_req.query.taxonomyType}`;
        res.send(errorMessage);
        return errorMessage;
    }
  });

  router.get('/fetchTaxonomyId', async (_req, res) => {
    const name = _req.query.name;
    switch (`${_req.query.taxonomyType}`) {
      case TaxonomyTypeEnum.AssetTaxonomy:
        let atId;
        assetClassificationData.map(taxonomy => {
          if (taxonomy.name == name) {
            atId = taxonomy.external_id;
            res.send(taxonomy.external_id)
          }});
        return atId;	
      default :
        const errorMessage: string = 'Invalid Taxonomy Type query param : ' + `${_req.query.taxonomyType}`;
        res.send(errorMessage);
        return errorMessage;
    }
  });

  router.get('/unclassifiedNode', async (_req, res) => {
    const unclassifiedTaxonomyNodeAsJson = getUnclassifiedTaxonomyNode(); 
    res.send(unclassifiedTaxonomyNodeAsJson);
    return unclassifiedTaxonomyNodeAsJson;
  }); 

  router.use(errorHandler()); 

  return router;
} 

const getUnclassifiedTaxonomyNode = () => {
  const unclassifiedTaxonomyNode: {id: number; parent_id: null; external_id: string; external_parent_id: string; name: string} = {
    id: 0,
    parent_id: null,
    external_id: 'U0000',
    external_parent_id: '',
    name: 'Unclassified'
  };
  return JSON.stringify(unclassifiedTaxonomyNode);
}