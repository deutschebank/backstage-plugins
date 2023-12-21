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

import React from 'react';
import { TabProps } from '@material-ui/core';
import { 
  Content, 
  ContentHeader, 
  Lifecycle, 
  PageWithHeader, 
  RoutedTabs, 
  SupportButton 
} from '@backstage/core-components';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.taxonomy.taxonomyLayoutRoute';

const Route: (props: SubRoute) => null = () => null;
attachComponentData(Route, dataKey, true);

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

type TaxonomyLayoutProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const TaxonomyLayout = ({
  children,
}: TaxonomyLayoutProps) => {
  const routes = useElementFilter(children, elements =>
    elements
      .selectByComponentData({
        key: dataKey,
        withStrictError:
          'Child of TaxonomyLayout must be an TaxonomyLayout.Route',
      })
      .getElements<SubRoute>()
      .map(child => child.props),
  );

  return (
    <PageWithHeader
      title={`Taxonomy Classified Asset View`}
      subtitle={<Lifecycle />}
      themeId="home"
    >
      <Content>
        <ContentHeader title="">
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <RoutedTabs routes={routes} />
      </Content>
    </PageWithHeader>  
  );
};

TaxonomyLayout.Route = Route;