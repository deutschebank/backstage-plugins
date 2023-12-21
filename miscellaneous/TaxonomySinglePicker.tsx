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

import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { 
	FormControl, 
	TextField 
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { 
	useApi, 
	identityApiRef 
} from '@backstage/core-plugin-api';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { useEffectOnce } from 'react-use';
import { taxonomyApiRef } from '@deutschebank/backstage-plugin-taxonomy';

/**
 * The input props that can be specified under `ui:options` for the
 * `TaxonomyPicker` field extension.
 *
 * @public
 */
export interface TaxonomyPickerUiOptions {
  taxonomyType?: TaxonomyTypeEnum[];
}

enum TaxonomyTypeEnum {
  AssetTaxonomy = 'assetTaxonomy'
}

/**
 * The underlying component that is rendered in the form for the `TaxonomySinglePicker`
 * field extension.
 *
 * @public
 */
export const TaxonomySinglePicker = (
  props: FieldExtensionComponentProps<string, TaxonomyPickerUiOptions>,
) => {
  const { formData, onChange, uiSchema } = props;
  const [inputError, setInputError] = useState(false);
  const taxonomyType = uiSchema['ui:options']?.taxonomyType;
  const taxonomyName = uiSchema['ui:options']?.taxonomyName;
  const identityApi = useApi(identityApiRef);
  const taxonomyApi = useApi(taxonomyApiRef);

  const { loading, value: existingTaxonomies } = useAsync(async () => {
    const { token } = await identityApi.getCredentials();
    const response = taxonomyApi.getTaxonomyByType(token, taxonomyType?.toString());
    const data = await response.then(response => response.json());
    return [...new Set(data.flatMap((e: any) => e.name) as string[])].sort();
  });

  const setTaxonomy = (_: React.ChangeEvent<{}>, values: string | null) => {
    // Reset error state in case all taxonomies were removed
    let hasError = false;
    let addDuplicate = false;

    console.log(values)

    setInputError(hasError);
    if (!hasError && !addDuplicate) {
      onChange(values);
    }
  };

  // Initialize field to always return an array
  useEffectOnce(() => onChange(formData));

  return (
    <FormControl margin="normal">
      <Autocomplete
        onChange={setTaxonomy}
        value={formData}
        loading={loading}
        options={existingTaxonomies || []}
        ChipProps={{ size: 'small' }}
        renderInput={params => (
          <TextField
            {...params}
            label={taxonomyName}
            helperText={`Map the ${taxonomyName} which this asset can be classified against.`}
            error={inputError}
          />
        )}
      />
    </FormControl>
  );
};