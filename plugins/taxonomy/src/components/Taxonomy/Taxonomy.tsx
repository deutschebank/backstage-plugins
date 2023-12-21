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

import React, { useEffect } from 'react';
import TreeView from 'devextreme-react/tree-view';
import Box from '@material-ui/core/Box';
import Container from 'react-bootstrap/Container';
import classNames from 'classnames';
import { Grid } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { 
  TaxonomyGridView,
  TaxonomyEntityGridListToggle
} from '../GridView'
import { TaxonomyEntityListView } from '../ListView';

export const Taxonomy = (props: { 
  taxonomyType: string;
  onTypeSelected: () => void;
  treeDataInput: [];
  selectItem: (e: any) => void;
  removeEntitiesSelection: () => void;
  setSelectedNode: (e: string) => void;
  childTreeNodes: Entity[];
  setchildTreeNodes: (e: Entity[]) => void;
  matchingEntities: Entity[];
  isGridToggle: boolean;
  handleListGridToggle: () => void;
  showTreeItemsAsGrid: boolean;
  gridListHeader: any;
  onTreeNodeCardClicked?: (treeData: [], treeNode: string) => void;
  showOwnerForEntityGridCard: boolean
  }) => {

  const { 
    taxonomyType,
    onTypeSelected,
    treeDataInput ,
    selectItem,
    removeEntitiesSelection,
    setSelectedNode,
    childTreeNodes,
    setchildTreeNodes,
    matchingEntities,
    isGridToggle,
    handleListGridToggle,
    showTreeItemsAsGrid,
    gridListHeader,
    onTreeNodeCardClicked,
    showOwnerForEntityGridCard
  } = props;

  if (onTypeSelected) 
    useEffect(onTypeSelected, [taxonomyType]);

    return (
          <Container style={{ marginLeft: 0, display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{
              boxShadow: 3,
              bgcolor: 'rgba(0, 0, 0, .09)',
              m: 1,
              p: 1,
              width: '20',
              height: '20',
              borderRadius: 4,
              border: '0px',
            }}>
              <TreeView
                width={300}
                height={700}
                dataStructure="plain"
                dataSource={treeDataInput}
                keyExpr="id"
                displayExpr="name"
                parentIdExpr="parent_id"
                focusStateEnabled={true}
                hoverStateEnabled={true}
                selectByClick={true}
                selectedExpr="selected"
                selectionMode="single"
                searchMode="contains"
                searchEnabled
                searchExpr="name"
                noDataText="No Data Found"
                expandNodesRecursive
                onItemClick={selectItem}
                onItemExpanded={selectItem}
                onItemCollapsed={removeEntitiesSelection}
               
              />
            </Box>
            <Grid>
              <Grid container justify="flex-end">
                <TaxonomyEntityGridListToggle
                  listGridToggle={isGridToggle}
                  handleListGridToggle={handleListGridToggle}
                />
              </Grid>
              <div className={classNames("grid", { "list-grid": isGridToggle })}>
                <div className="list-item" data-item="true">
                  {gridListHeader}
                  {!isGridToggle && 
                    <div>
                      <TaxonomyEntityListView matchingEntities={matchingEntities} />
                    </div> 
                  }
                  {isGridToggle && 
                    <div>
                      <TaxonomyGridView 
                        matchingEntities={matchingEntities} 
                        selectItem={selectItem}
                        treeData={treeDataInput}
                        setSelectedNode={setSelectedNode}
                        childTreeNodes={childTreeNodes}
                        setchildTreeNodes={setchildTreeNodes}
                        showTreeItemsAsGrid={showTreeItemsAsGrid}
                        onTreeNodeCardClicked={onTreeNodeCardClicked}
                        showOwnerForEntityGridCard={showOwnerForEntityGridCard}/>
                    </div>
                  }
                </div>
              </div>
            </Grid>
          </Container>
    );
}
