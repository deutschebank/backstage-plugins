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

import React from 'react'
import {
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { ItemCardHeader } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';
import { Info } from '@material-ui/icons';
import { 
  getListOfChildElementsForAGivenTreeNodeAsEntities, 
  returnNodeForGivenNodeName 
} from '../../utils';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    position: 'relative'
  },
  title: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage
  },
  toolTip: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    padding: '0.25rem',
    color: '#fff',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    width: '100%',
    border: 'none',
    boxShadow: 'none'
  }
}));

export const TaxonomyTreeGridCardView = (props: { 
  selectItem: (state: any) => void;
  entity: Entity,
  treeData: [],
  setSelectedNode: (state: string) => void;
  setchildTreeNodes: (state: Entity[]) => void;
  onTreeNodeCardClicked?: (treeData: [], treeNode: string) => void;
  }) => {
  
  const { selectItem, entity, treeData, setSelectedNode, setchildTreeNodes, onTreeNodeCardClicked } = props;

  const backstageTheme = useTheme<BackstageTheme>();
  const themeId = 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });

  const renderCardBodyWithEntityDescription = (entity: Entity) => {
    let entityDescription = entity?.metadata?.description ?? entity.metadata.name;
    return entityDescription;
  }

  const onClick = () => {
    const childTreeNodes = getListOfChildElementsForAGivenTreeNodeAsEntities(treeData, entity.metadata.name);
    setSelectedNode(entity.metadata.name);
    setchildTreeNodes(childTreeNodes);
    if(onTreeNodeCardClicked)
      onTreeNodeCardClicked(treeData, entity.metadata.name);
    //For a child node, map the real entities. So, to fetch real entities get the treenode based on nodename.
    //TODO : We need to find a better way here.
    if(childTreeNodes.length == 0) 
      selectItem({itemData: returnNodeForGivenNodeName(treeData, entity.metadata.name)});
  }

  return (
    <Card className={classes.card} variant='elevation' square={true}>
      <CardActionArea centerRipple onClick={onClick} >
        <CardMedia className={classes.cardHeader} >
          <Tooltip 
            title={
                    <React.Fragment>
                      <Typography color="inherit">{renderCardBodyWithEntityDescription(entity)}</Typography>
                    </React.Fragment>
                  } 
            className={classes.toolTip}>
              <IconButton classes={{ root: classes.toolTip }}>
                <Info />
              </IconButton>
          </Tooltip>
          <ItemCardHeader
            title={entity.metadata.name}
            subtitle={entity?.spec?.type}
            classes={{ root: classes.title }}
          />
        </CardMedia>
      </CardActionArea>
    </Card>
  )
}