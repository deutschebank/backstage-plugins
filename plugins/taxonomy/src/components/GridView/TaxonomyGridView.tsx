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

import React, { ChangeEvent, useState } from 'react'
import {
  Grid
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { TaxonomyEntityGridPagination } from './EntityGridView/TaxonomyEntityGridPagination';
import { TaxonomyEntityGridCardView } from './EntityGridView/TaxonomyEntityGridCardView';
import { TaxonomyTreeGridCardView } from './TreeGridView/TaxonomyTreeGridCardView';

export const TaxonomyGridView = (props: { 
  matchingEntities: Entity[],
  selectItem: (state: any) => void;
  showOwnerForEntityGridCard: boolean,
  showTreeItemsAsGrid: boolean;
  treeData: [],
  setSelectedNode: (state: string) => void;
  childTreeNodes: Entity[],
  setchildTreeNodes: (state: Entity[]) => void;
  onTreeNodeCardClicked?: (treeData: [], treeNode: string) => void;
  }) => {
  
  const { 
    matchingEntities, 
    selectItem, 
    showOwnerForEntityGridCard, 
    showTreeItemsAsGrid, 
    treeData, 
    setSelectedNode, 
    childTreeNodes, 
    setchildTreeNodes,
    onTreeNodeCardClicked
  } = props;

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRows(parseInt(event.target.value, 20));
    setPage(1);
  };

  return (
      <Grid>
        <Grid wrap='wrap' container spacing={2}>
          {showTreeItemsAsGrid &&
            childTreeNodes
              .slice((page - 1) * rows, rows * page)
              .map((entity: Entity) => {
                return (
                  <Grid item xs={4} >
                    <TaxonomyTreeGridCardView
                      selectItem={selectItem}
                      entity={entity}
                      treeData={treeData}
                      setchildTreeNodes={setchildTreeNodes}
                      setSelectedNode={setSelectedNode}
                      onTreeNodeCardClicked={onTreeNodeCardClicked}/>
                  </Grid>
                )
            })
          }
          {matchingEntities
            .slice((page - 1) * rows, rows * page)
            .map((entity: Entity) => {
              return (
                <Grid item xs={3} >
                  <TaxonomyEntityGridCardView 
                    entity={entity}
                    showOwnerForEntityGridCard={showOwnerForEntityGridCard}
                  />
                </Grid>
              )
            })
          }
        </Grid>
        <TaxonomyEntityGridPagination 
          matchingEntities={childTreeNodes.length == 0 ? matchingEntities : childTreeNodes} 
          handleRowChange={handleRowChange}
          handlePageChange={handlePageChange}
          page={page}
          rows={rows}
        />
      </Grid>
    )
}