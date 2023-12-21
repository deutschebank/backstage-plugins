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

import React, { ChangeEvent } from 'react'
import { TablePagination } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';

export const TaxonomyEntityGridPagination = (props: { 
  matchingEntities: Entity[],
  page: number,
  rows: number
  handlePageChange: (_: any, newPage: number) => void,
  handleRowChange: (event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  }) => {
  
  const { 
    matchingEntities, 
    page, 
    rows, 
    handlePageChange, 
    handleRowChange 
  } = props;
  
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 20]}
      count={matchingEntities?.length}
      page={page - 1}
      onPageChange={handlePageChange}
      rowsPerPage={rows}
      onRowsPerPageChange={handleRowChange}
      backIconButtonProps={{ disabled: page === 1 }}
      nextIconButtonProps={{
                          disabled: rows * page >= matchingEntities.length,
                        }}
      width={5000}
    />
  )
}