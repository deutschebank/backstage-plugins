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

import crossFetch from 'cross-fetch';
import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { FetchApi } from './fetch';
import { TaxonomyApi } from './api';
import { TaxonomyTypeEnum } from './types';

export class TaxonomyClient implements TaxonomyApi {

  private readonly configApi: Config;
  private readonly fetchApi: FetchApi;

  private constructor(configApi: Config, fetchApi?: { fetch: typeof fetch }) {
    this.configApi = configApi;
    this.fetchApi = fetchApi || { fetch: crossFetch };
  }

  static fromConfig(configApi: Config) {
    return new TaxonomyClient(configApi);
  }

  async getEntityMetadataForUnclassifiedTaxonomiesByType(
    token?: string, 
    taxonomyType?: String
  ): Promise<Entity[]> {

    const backendUrl = this.configApi.getString('backend.baseUrl');

    const entityComponentAndApiURL = `${backendUrl}/api/catalog/entities?filter=kind=component&filter=kind=api`;
    
    const httpOptions = this.constructHttpOptionsForGet(token);

    const allEntityComponentsAndApis = await this.fetchApi.fetch(`${entityComponentAndApiURL}`,httpOptions);
    let parsedAllEntityComponentsAndApis = await allEntityComponentsAndApis.json();

    switch(taxonomyType) {
      case TaxonomyTypeEnum.AssetTaxonomy :
        parsedAllEntityComponentsAndApis = parsedAllEntityComponentsAndApis.filter((entity: any) => entity.metadata?.taxonomies?.assetTaxonomy === undefined || entity.metadata?.taxonomies?.assetTaxonomy?.includes('NA'));
        break;
    }
    if(parsedAllEntityComponentsAndApis.length > 0)
      return parsedAllEntityComponentsAndApis.map((entry: Entity) => { return (entry)});
    else 
      return [];
  }

  async getEntityMetadataTaxonomiesByType(
    token?: string, 
    taxonomyType?: String, 
    externalId?: String
  ): Promise<Entity[]> {

    const backendUrl = this.configApi.getString('backend.baseUrl');
    const entityMetadataTaxonomiesUrl = `${backendUrl}/api/catalog/entities?filter=metadata.taxonomies`;

    const httpOptions = this.constructHttpOptionsForGet(token);

    const response = await this.fetchApi.fetch(`${entityMetadataTaxonomiesUrl}.${taxonomyType} = ${externalId}`, httpOptions)
    const jsonResponse = await response.json();
    if(jsonResponse.length > 0)
      return jsonResponse.map((entry: Entity) => { return (entry)});
    else 
      return [];
  }

  async getUnclassifiedNode(
    token?: string
  ): Promise<any> {

    const backendUrl = this.configApi.getString('backend.baseUrl');
    const unclassifiedNodeUrl = `${backendUrl}/api/taxonomy/unclassifiedNode`;

    const httpOptions = this.constructHttpOptionsForGet(token);

    const response = this.fetchApi.fetch(`${unclassifiedNodeUrl}`, httpOptions);

    return response;
  }

  async getTaxonomyByType(
    token?: string, 
    taxonomyType?: String
  ): Promise<any> {

    const backendUrl = this.configApi.getString('backend.baseUrl');
    const taxonomyUrl = `${backendUrl}/api/taxonomy?taxonomyType=`;

    const httpOptions = this.constructHttpOptionsForGet(token);

    const response = this.fetchApi.fetch(`${taxonomyUrl}${taxonomyType}`, httpOptions);
    
    return response;
  }

  private constructHttpOptionsForGet(
    token?: string
  ): RequestInit {

    const httpOptions: RequestInit = {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    return httpOptions;
  }
}