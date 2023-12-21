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

export const assetClassificationData = [
    {
		"id": 1001,
		"parent_id": null,
		"external_id": "AT0001",
		"external_parent_id": "",
		"name": "UI",
		"level": "L1"
	},
	{
		"id": 1002,
		"parent_id": 1001,
		"external_id": "AT0002",
		"external_parent_id": "AT0001",
		"name": "Frameworks",
		"level": "L2"
	},
	{
		"id": 1004,
		"parent_id": null,
		"external_id": "AT0004",
		"external_parent_id": "",
		"name": "Libraries",
		"level": "L1"
	},
	{
		"id": 1005,
		"parent_id": null,
		"external_id": "AT0005",
		"external_parent_id": "",
		"name": "Data Science",
		"level": "L1"
	},
	{
		"id": 1006,
		"parent_id": 1005,
		"external_id": "AT0006",
		"external_parent_id": "AT0005",
		"name": "Machine Learning",
		"level": "L2"
	},
	{
		"id": 1007,
		"parent_id": 1005,
		"external_id": "AT0007",
		"external_parent_id": "AT0005",
		"name": "AI",
		"level": "L2"
	},
	{
		"id": 1009,
		"parent_id": null,
		"external_id": "AT0009",
		"external_parent_id": "",
		"name": "Code",
		"level": "L1"
	},
	{
		"id": 1010,
		"parent_id": 1009,
		"external_id": "AT0010",
		"external_parent_id": "AT0009",
		"name": "Python",
		"level": "L2"
	},
	{
		"id": 1011,
		"parent_id": 1009,
		"external_id": "AT0011",
		"external_parent_id": "AT0009",
		"name": "Java",
		"level": "L2"
	},
	{
		"id": 1012,
		"parent_id": null,
		"external_id": "AT0012",
		"external_parent_id": "",
		"name": "Data Models",
		"level": "L1"
	},
	{
		"id": 1014,
		"parent_id": null,
		"external_id": "AT0014",
		"external_parent_id": "",
		"name": "Security",
		"level": "L1"
	},
	{
		"id": 1015,
		"parent_id": null,
		"external_id": "AT0015",
		"external_parent_id": "",
		"name": "Services",
		"level": "L1"
	},
	{
		"id": 1016,
		"parent_id": null,
		"external_id": "AT0016",
		"external_parent_id": "",
		"name": "Monitoring",
		"level": "L1"
	},
	{
		"id": 1017,
		"parent_id": null,
		"external_id": "AT0017",
		"external_parent_id": "",
		"name": "Content Management",
		"level": "L1"
	},
	{
		"id": 1018,
		"parent_id": null,
		"external_id": "AT0018",
		"external_parent_id": "",
		"name": "Automation",
		"level": "L1"
	}
]