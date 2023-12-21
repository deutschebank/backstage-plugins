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

import React from "react"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useTheme
} from '@material-ui/core';
import { Entity, DEFAULT_NAMESPACE, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { ItemCardHeader, MarkdownContent } from "@backstage/core-components";
import { useApi, useRouteRef } from "@backstage/core-plugin-api";
import { EntityRefLinks, entityRouteRef, getEntityRelations } from "@backstage/plugin-catalog-react";
import { BackstageTheme } from "@backstage/theme";
import { configApiRef } from '@backstage/core-plugin-api';
import { Info } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    position: 'relative'
  },
  titleDefault: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage,
  },
  titleFoundationalADR: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage,
  },
  titleServiceADR: {
    backgroundImage: 'linear-gradient(-100deg, #1CDD4B 0%, #0E3118 70%)'
  },
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
    paddingBottom: '0.8em',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 1,
    paddingBottom: '0.2rem',
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%'
  },
  toolTip: {
    position: 'absolute',
    top: theme.spacing(0.1),
    right: theme.spacing(0.1),
    padding: '0.1rem',
    color: '#ffff',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(2),
  },
  tags: {
    textDecoration: 'underline'
  },
}));

export const TaxonomyEntityGridCardView = (props: { 
  entity: Entity,
  showOwnerForEntityGridCard: boolean
  }) => {
  
  const { entity, showOwnerForEntityGridCard } = props;

  const configApi = useApi(configApiRef);
  const appBaseUrl = configApi.getString('app.baseUrl');

  const backstageTheme = useTheme<BackstageTheme>();

  const themeId = 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });

  const entityRoute = useRouteRef(entityRouteRef);

  const getEntityUrl = () => {
    const routeParams = {
      name: entity.metadata.name,
      kind: entity.kind,
      namespace: entity.metadata.namespace?.toLocaleLowerCase('en-US') ?? DEFAULT_NAMESPACE,
    }
    const target = entityRoute(routeParams);
    return target;
  }

  const renderCardBodyWithEntityDescription = (entity: Entity) => {
    let entityDescription = entity.metadata.name;
    if(entity?.metadata?.description) {
      entityDescription = entity?.metadata?.description.split(".", 1)[0];
      entityDescription.split("");
      entityDescription = `${entityDescription}.`;
    }
    return entityDescription;
  }

  const constructTagsFilterUrl = (kind: String, tag: string) => {
    return `${appBaseUrl}/catalog?filters%5Bkind%5D=${kind}&filters%5Buser%5D=all&filters%5Btags%5D=${tag}`;
  }

  const getEntityRelationship = (entity: Entity) => {
    return getEntityRelations(entity as Entity, RELATION_OWNED_BY);
  }

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardHeader}>
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
          classes={{ root: classes.titleDefault }}
        />
      </CardMedia>
      <CardActionArea centerRipple href={getEntityUrl()} target="_blank" >
        <CardContent style={{ display: 'grid' }}>
          <Box className={classes.box}>
            <Typography variant="body2" className={classes.label}>
              Description
            </Typography>
            <MarkdownContent content={renderCardBodyWithEntityDescription(entity)} />
          </Box>
        </CardContent>
      </CardActionArea>
      <CardContent style={{ display: 'grid' }}>
        {showOwnerForEntityGridCard && getEntityRelationship(entity).length != 0 &&
          <Box className={classes.box}>
            <Typography variant="body2" className={classes.label}>
              Owner
            </Typography>
            <EntityRefLinks entityRefs={getEntityRelationship(entity)} defaultKind="Group" target="_blank" />
          </Box>
        }
        {entity?.metadata?.tags &&
          <Box>
            <Typography variant="body2" className={classes.label}>
              Tags
            </Typography>
            {entity?.metadata?.tags?.map(tag => (
              <Chip 
                size="small" 
                label={tag} 
                component="a" 
                href={constructTagsFilterUrl(entity.kind, tag)} 
                clickable 
                target="_blank" 
                className={classes.tags}/>
            ))}
          </Box>
        }
      </CardContent>
    </Card>
  )
}