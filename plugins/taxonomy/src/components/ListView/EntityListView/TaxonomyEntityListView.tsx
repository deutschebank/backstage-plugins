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

import React, { forwardRef } from 'react';
import { Link } from '@material-ui/core';
import { 
  Entity, 
  DEFAULT_NAMESPACE 
} from '@backstage/catalog-model';
import { useRouteRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import MaterialTable from '@material-table/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />),
};

export const TaxonomyEntityListView = (props: { 
  matchingEntities: Entity[] 
  }) => {
  
  const { matchingEntities } = props;

  const entityRoute = useRouteRef(entityRouteRef);

  const renderEntityNameAsLink = (entity: Entity) => {
    const routeParams = {
      name: entity.metadata.name,
      kind: entity.kind,
      namespace: entity.metadata.namespace?.toLocaleLowerCase('en-US') ?? DEFAULT_NAMESPACE,
    }
    const target = entityRoute(routeParams);
    return <Link href={target} 
                 target="_blank"
                 color="inherit"
                 align="center">
              {entity.metadata.name}
           </Link >;
  }

  return (
    <MaterialTable
      icons={tableIcons}
      title={""}
      columns={[
        { title: 'NAME', field: 'name', width: "60%", render: rowData => <Link href="#">{rowData.name}</Link> },
        { title: 'OWNER', field: 'owner', width: "30%" },
        { title: 'TYPE', field: 'type', width: "30%" },
        { title: 'LIFECYCLE', field: 'lifecycle', width: "30%" },
        { title: 'TAGS', field: 'tags', width: "60%" },
      ]}
      data={matchingEntities?.map((entity) => {
        return {
          name: renderEntityNameAsLink(entity),
          owner: entity?.relations?.find(x => x.type == 'ownedBy')?.targetRef?.split("/")[1],
          type: entity?.spec?.type,
          lifecycle: entity?.spec?.lifecycle,
          tags: entity?.metadata?.tags?.join(","),
        }
      })}
      options={{
        search: false,
        pageSize: 20,
        tableLayout: 'fixed',
        maxBodyHeight: 600,
        paginationType: 'stepped',
        rowStyle: {
          overflowWrap: 'break-word'
        },
      }}
    />
  )
}