/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {useThunk} from 'frontend-js-react-web';
import React, {createContext, useReducer} from 'react';

import reducer from './reducer.es';

export const CommentsContext = createContext();

const getInitialState = (entryId) => ({
	comments: [
		{
			author: {fullName: 'Test Test', portraitURL: '', userId: '20126'},
			body: '<p>test comment</p>',
			children: [
				{
					author: {
						fullName: 'Test Test',
						portraitURL: '',
						userId: '20126',
					},
					body: '<p>test reply</p>',
					children: [
						{
							author: {
								fullName: 'Test Test',
								portraitURL: '',
								userId: '20126',
							},
							body: '<p>test reply 2</p>',
							children: [
								{
									author: {
										fullName: 'Test Test',
										portraitURL: '',
										userId: '20126',
									},
									body: '<p>test reply 2</p>',
									commentId: '41276',
									dateDescription: '3 Minutes Ago',
									edited: false,
									modifiedDateDescription: '3 Minutes Ago',
								},
							],
							commentId: '41276',
							dateDescription: '3 Minutes Ago',
							edited: false,
							modifiedDateDescription: '3 Minutes Ago',
						},
					],
					commentId: '41275',
					dateDescription: '5 Minutes Ago',
					edited: false,
					modifiedDateDescription: '5 Minutes Ago',
				},
				{
					author: {
						fullName: 'Test Test',
						portraitURL: '',
						userId: '20126',
					},
					body: '<p>test reply 2</p>',
					commentId: '41276',
					dateDescription: '3 Minutes Ago',
					edited: false,
					modifiedDateDescription: '3 Minutes Ago',
				},
			],
			commentId: '41274',
			dateDescription: '7 Minutes Ago',
			edited: false,
			modifiedDateDescription: '7 Minutes Ago',
		},
		{
			author: {fullName: 'Test Test', portraitURL: '', userId: '20126'},
			body: '<p>test comment 2</p>',
			children: [],
			commentId: '41277',
			dateDescription: '2 Minutes Ago',
			edited: false,
			modifiedDateDescription: '2 Minutes Ago',
		},
	],
	entryId,
});

export function CommentsContextProvider({children, entryId}) {
	const store = useThunk(useReducer(reducer, getInitialState(entryId)));

	return (
		<CommentsContext.Provider value={store}>
			{children}
		</CommentsContext.Provider>
	);
}
