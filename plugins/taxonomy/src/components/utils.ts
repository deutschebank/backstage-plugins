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

import { Entity } from '@backstage/catalog-model';

const returnParentNameForGivenNodeName = (treeData: [], name : string) => {
    let parentName: string[] = [];
    treeData.forEach((e: any) => {
      if(e.name == name) {
        parentName = treeData.filter((a:any) => e.parent_id == a.id)
                             .map((x: any) => x.name);
      } 
    });
    return parentName[0];
}

export const returnNodeForGivenNodeName = (treeData: [], nodeName: string) => {
  let node: string[] = [];
  node = treeData.filter((e: any) => e.name == nodeName);
  return node[0];
}
  
export const getListOfChildElementsForAGivenTreeNodeAsEntities = (
    treeData: [], 
    selectedNode: string
    ):Entity[] => {
    let selectedTreeEntriesForArchitectureCapabilityMap: Entity[] = [];
    let rootNode = '';
    const mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap: Map<string, Entity[]> = new Map<string, Entity[]>();
    if(treeData != undefined && treeData != null && treeData.length > 0) {
      treeData.forEach((data: any) => {
        const entity = {
          apiVersion: 'v1',
          kind: 'Component',
          metadata: {
            name: data.name,
            description: data.description ?? data.name
          }
        };
        if(data.parent_id == null) {
            rootNode = data.name
        }
        if(!mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap.has(returnParentNameForGivenNodeName(treeData, data.name)))
          mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap.set(returnParentNameForGivenNodeName(treeData, data.name), [entity]);
        else
          mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap.get(returnParentNameForGivenNodeName(treeData, data.name))?.push(entity);
      });
      if(selectedNode == undefined || selectedNode == null || selectedNode == '')
        selectedTreeEntriesForArchitectureCapabilityMap = mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap.get(rootNode) ?? [];
      else 
        selectedTreeEntriesForArchitectureCapabilityMap = mapOfNodeAndListOfChildElemenetsForArchitectureCapabilityMap.get(selectedNode) ?? [];
    }
    return selectedTreeEntriesForArchitectureCapabilityMap;
}

export const getExternalIdForAGivenTreeNodeName = (
  treeData: [],
  treeNodeName: string
): String => {
  let externalId = '';
  if(treeData != undefined && treeData != null && treeData.length > 0) {
    const matchingExternalIds: string[] = treeData.filter((data: any) => data.name == treeNodeName)
                                                  .map((data: any) => data.external_id);
    externalId = matchingExternalIds?.[0];
  }
  return externalId;
}

export const getNameForAGivenTreeNodeExternalId = (
  treeData: [],
  treeNodeExternalId: string
): string => {
  let name = '';
  if(treeData != undefined && treeData != null && treeData.length > 0) {
    const matchingNames: string[] = treeData.filter((data: any) => data.external_id === treeNodeExternalId)
                                            .map((data: any) => data.name);
    name = matchingNames?.[0];
  }
  return name;
}

export const getNodeForAGivenTreeNodeExternalId = (
  treeData: [],
  treeNodeExternalId: string
): string => {
  let node: any = undefined;
  if(treeData != undefined && treeData != null && treeData.length > 0) {
    const matchingNode: string[] = treeData.filter((data: any) => data.external_id === treeNodeExternalId);
    node = matchingNode?.[0];
  }
  return node;
}