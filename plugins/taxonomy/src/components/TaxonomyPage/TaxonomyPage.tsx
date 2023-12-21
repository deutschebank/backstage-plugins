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

import React, { useCallback, useEffect, useState } from 'react';
import { 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';
import { 
  identityApiRef, 
  useApi 
} from '@backstage/core-plugin-api';
import { TaxonomyLayout } from '../TaxonomyLayout';
import { taxonomyApiRef } from '../../plugin';
import { TaxonomyTypeEnum } from '@deutschebank/backstage-taxonomy-client';
import { 
  getExternalIdForAGivenTreeNodeName, 
  getListOfChildElementsForAGivenTreeNodeAsEntities,
  getNameForAGivenTreeNodeExternalId
} from '../utils';
import { Taxonomy } from '../Taxonomy';

export const TaxonomyPage = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [ unclassifiednodeExternalId,  setUnclassifiednodeExternalId ]  = useState<string>('');
  const identityApi = useApi(identityApiRef);
  const [token, setToken] = useState("");
  const taxonomyApi = useApi(taxonomyApiRef);

  //Asset Taxonomy Start
  const assetClassificationType = TaxonomyTypeEnum.AssetTaxonomy;
  const [childTreeNodesAT, setchildTreeNodesAT] = useState<Entity[]>([]);
  const [selectedNodeAT, setSelectedNodeAT] = useState<string>('');
  const [treeDataAT, setTreeDataAT] = useState<[]>([]);
  const [matchingEntitiesAT, setMatchingEntitiesAT] = useState<Entity[]>([]);
  const [currentToggleAT, setCurrentToggleAT] = useState("list");
  const isGridToggleAT = currentToggleAT === "grid";
  const showTreeItemsAsGridAT = false;

  const handleListGridToggleAT = useCallback(() => {
    setCurrentToggleAT((view: string) => (view === "grid" ? "list" : "grid"));
  }, [setCurrentToggleAT]);

  const removeEntitiesSelectionAT = () => {
    setSelectedNodeAT('');
    setMatchingEntitiesAT([]);
    setchildTreeNodesAT(getListOfChildElementsForAGivenTreeNodeAsEntities(treeDataAT, ''));
  }

  const fetchTaxonomyATAndSetMatchingEntities = (nodeExternalId: string) => {
    if (nodeExternalId == unclassifiednodeExternalId)
      taxonomyApi.getEntityMetadataForUnclassifiedTaxonomiesByType(token, assetClassificationType).then(response => setMatchingEntitiesAT(response));
    else
      taxonomyApi.getEntityMetadataTaxonomiesByType(token, assetClassificationType, nodeExternalId).then(response => setMatchingEntitiesAT(response));
  }

  const selectItemAT = (e: any) => {
    fetchTaxonomyATAndSetMatchingEntities(e.itemData.external_id);
    const treeNodeExternalId: String = getExternalIdForAGivenTreeNodeName(treeDataAT,e.itemData.name);
    navigate(`${assetClassificationType}?id=${treeNodeExternalId}`);
    setSelectedNodeAT(e.itemData.name);
    setchildTreeNodesAT(getListOfChildElementsForAGivenTreeNodeAsEntities(treeDataAT, e.itemData.name));
  }

  const fetchTaxonomyAT = useAsync(async () => {
    const response = taxonomyApi.getTaxonomyByType(token, assetClassificationType);
    const data = await response.then(response => response.json());
    setTreeDataAT(data);
    return data;
  }, [token]).value;
  //Asset Taxonomy End

  //Common Start
  const treeDataStates: {[key: string]: [[], string]} = {
    [TaxonomyTypeEnum.AssetTaxonomy]: [treeDataAT, selectedNodeAT]
  };

  const onTabSelected = (type: TaxonomyTypeEnum) => () => {
    if (!treeDataStates[type]) 
      return;

    const [treeData, selectedNode] = treeDataStates[type];
    const nodeId: String = getExternalIdForAGivenTreeNodeName(treeData, selectedNode);

    if (selectedNode && nodeId && !location.search.includes(`?id=${nodeId}`)) {
      setTimeout(() => {
        navigate(`${type}?id=${nodeId}`);
      }, 200);
    }
  }

  useEffect(()=>{
    const fetchToken = async () => {
      const { token } = await identityApi.getCredentials();
      return token;
    }
    fetchToken().then(response => setToken(response === undefined ? "" : response))
    taxonomyApi.getUnclassifiedNode(token)
               .then(response => response.json())
               .then(response => setUnclassifiednodeExternalId(response.external_id))
  },[token]);

  useEffect(() => {
    const taxonomyTreeNodeExternalId = getExternalTreeNodeIdFromLocationurl();
    const taxonomyType = getTaxonomyTypeFromLocationUrl();
    switch(taxonomyType) {
      case TaxonomyTypeEnum.AssetTaxonomy:
        if(taxonomyTreeNodeExternalId != '') {
          const treeNodeName: string = getNameForAGivenTreeNodeExternalId(treeDataAT, taxonomyTreeNodeExternalId)
          setSelectedNodeAT(treeNodeName);
          const constructedData: Entity[] = getListOfChildElementsForAGivenTreeNodeAsEntities(treeDataAT, treeNodeName);
          setchildTreeNodesAT(constructedData);
          fetchTaxonomyATAndSetMatchingEntities(taxonomyTreeNodeExternalId);
        } else {
          const constructedData: any = getListOfChildElementsForAGivenTreeNodeAsEntities(treeDataAT, "");
          setchildTreeNodesAT(constructedData);
          removeEntitiesSelectionAT();
        }
        break;      
    }
  }, [location, treeDataAT]);
  //Common End

  return (
    <TaxonomyLayout>
      <TaxonomyLayout.Route 
        path={TaxonomyTypeEnum.AssetTaxonomy} 
        title="Asset Classification"
      >
        <Taxonomy 
          taxonomyType={TaxonomyTypeEnum.AssetTaxonomy}
          onTypeSelected={onTabSelected(TaxonomyTypeEnum.AssetTaxonomy)}
          treeDataInput={fetchTaxonomyAT}
          selectItem={selectItemAT}
          removeEntitiesSelection={removeEntitiesSelectionAT}
          setSelectedNode={setSelectedNodeAT}
          childTreeNodes={childTreeNodesAT}
          setchildTreeNodes={setchildTreeNodesAT}
          matchingEntities={matchingEntitiesAT}
          isGridToggle={isGridToggleAT}
          handleListGridToggle={handleListGridToggleAT}
          showTreeItemsAsGrid={showTreeItemsAsGridAT}
          gridListHeader={gridListHeaderChangeGeneral(matchingEntitiesAT, selectedNodeAT)}
          showOwnerForEntityGridCard={true}
        />
      </TaxonomyLayout.Route>
    </TaxonomyLayout>
  );
};

const gridListHeaderChangeGeneral = (matchingEntities: Entity[], selectedNode: string) => {
  if(selectedNode == undefined || selectedNode == null || selectedNode == '')
    return (<h3>Entities ({matchingEntities?.length})</h3>);
  else
    return (<h3>{selectedNode} Entities ({matchingEntities?.length})</h3>);
}

const getTaxonomyTypeFromLocationUrl = () => {
  const locationPathNameSplit: string[] = location?.pathname?.split('/');
  if(locationPathNameSplit.length == 3) {
    return locationPathNameSplit[2];
  } else
      return '';
}

const getExternalTreeNodeIdFromLocationurl = () => {
  const locationSearchParam: string = location?.search;
  if(locationSearchParam != undefined && locationSearchParam != null && locationSearchParam != '') {
    return locationSearchParam?.split('?id=')?.[1]
  } else
      return '';
}