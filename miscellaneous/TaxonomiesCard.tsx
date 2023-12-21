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

import React, { useState }from 'react';
import { useAsync } from 'react-use';
import { forwardRef } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { 
  useApi, 
  identityApiRef 
} from '@backstage/core-plugin-api';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MTable, { MTableHeader } from '@material-table/core';
import { BackstageTheme } from '@backstage/theme';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { taxonomyApiRef } from '@deutschebank/backstage-plugin-taxonomy';
import { TaxonomyTypeEnum } from '@deutschebank/backstage-taxonomy-client';
import { TaxomomyType } from './types';

const tableIcons = {
  Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />),
};

const StyledMTableHeader = withStyles(
  theme => ({
    header: {
      padding: theme.spacing(1, 2, 1, 2.5),
      borderTop: `1px solid ${theme.palette.grey.A100}`,
      borderBottom: `1px solid ${theme.palette.grey.A100}`,
      // withStyles hasn't a generic overload for theme
      color: (theme as BackstageTheme).palette.textSubtle,
      fontWeight: 'bold',
      position: 'static',
      wordBreak: 'normal',
    },
  }),
  { name: 'BackstageTableHeader' },
)(MTableHeader);

export function TaxonomiesCard() {

  const { entity } = useEntity();

  //JSON Stringify because we cannot use entity dereferencing of the custom objects defined under metadata definition.
  const entityjsonString = JSON.stringify(entity);
  const entityjsonObject = JSON.parse(entityjsonString);

  const assetClassification: TaxomomyType[] = retrieveTaxonomies(entityjsonObject.metadata?.taxonomies?.assetTaxonomy, TaxonomyTypeEnum.AssetTaxonomy, 'Asset Classification');

  const allTaxonomies = [...assetClassification];
   
  return (
    <MTable
      components={{
        Header: StyledMTableHeader,
      }}
      options={{
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
        headerStyle:{
          color: '#000000'
        }
      }}
      columns={[
        { title: 'TYPE', field: 'type', width: "30%"},
        { title: 'NAME', field: 'name', width: "30%" },
        { title: 'LEVEL', field: 'level', width: "30%" },
        { title: 'DESCRIPTION', field: 'description', width: "30%" }
      ]}
      icons={tableIcons}
      title={
         <>
          <Typography variant="h5" component="h3">
            {'Taxonomies'}
          </Typography>
        </>
      }
      data={allTaxonomies.map((taxonomy: any) => {
        return {
          type: taxonomy.type,
          name: taxonomy.name,
          level: taxonomy.level ? taxonomy.level : taxonomy.description.substring(0,2),
          description: taxonomy.description,
       }
      })}
      style={{ width: '100%' }}
    />
  );
}

function retrieveTaxonomies(
  taxonomyIds: undefined | String[], 
  taxonomyTypeEnum: TaxonomyTypeEnum, 
  taxonomyString: string
) : TaxomomyType[] {
  
  const identityApi = useApi(identityApiRef);
  const taxonomyApi = useApi(taxonomyApiRef);

  const [data, setData] = useState<{}>({});
  const fetchAllTaxonomy = useAsync(async () => {
    const { token } = await identityApi.getCredentials();
    const response = taxonomyApi.getTaxonomyByType(token, taxonomyTypeEnum);
    const data = await response.then(response => response.text());
    setData(data);
    return data;
  }, []);

  if (fetchAllTaxonomy.loading || !data) {
  } else if (fetchAllTaxonomy.error) {
  } else {
    const parsedJson = JSON.parse(data as string);
    if(parsedJson?.response?.statusCode == 500) {
      console.info("Error Retrieving " + taxonomyString);
    } else {
      const filteredTaxonomy: TaxomomyType[] = [];
      taxonomyIds?.forEach((taxonomyId: String) => {
        //There will always ever be one taxonomy for a given external id.
        if( taxonomyId != 'NA') {
          filteredTaxonomy.push(parsedJson.filter((e: any) => e.external_id == taxonomyId)[0]);
          filteredTaxonomy.forEach((e: TaxomomyType) => e.type = taxonomyString);
        }
      });
      return filteredTaxonomy;
    }
  }
  return [{
    type: '',
    name: '',
    level: '',
    description: ''
  }];
}