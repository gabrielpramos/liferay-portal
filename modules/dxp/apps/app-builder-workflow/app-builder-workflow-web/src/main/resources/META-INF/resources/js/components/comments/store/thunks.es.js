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

import {
	addItem,
	deleteItem,
	getItem,
	updateItem,
} from 'app-builder-web/js/utils/client.es';

import {
	ADD_ENTRY_COMMENT,
	DELETE_ENTRY_COMMENT,
	EDIT_ENTRY_COMMENT,
	SET_ENTRY_COMMENTS,
} from './types.es';

const BASE_URL = '';

export function addEntryComment({body, entryId, parentCommentId}) {
	return (dispatch) =>
		addItem(`${BASE_URL}/${entryId}/add-comment`, {
			body,
			parentCommentId,
		}).then((comment) => dispatch({comment, type: ADD_ENTRY_COMMENT}));
}

export function deleteEntryComment({commentId}) {
	return (dispatch) =>
		deleteItem(`${BASE_URL}/delete-comment/${commentId}`).then(() =>
			dispatch({commentId, type: DELETE_ENTRY_COMMENT})
		);
}

export function editEntryComment({body, commentId}) {
	return (dispatch) =>
		updateItem(`${BASE_URL}/update-comment/`, {
			body,
			commentId,
		}).then((comment) =>
			dispatch({comment, commentId, type: EDIT_ENTRY_COMMENT})
		);
}

export function getEntryComments({entryId}) {
	return (dispatch) =>
		getItem(`${BASE_URL}/comments/${entryId}`).then(({comments}) =>
			dispatch({comments, type: SET_ENTRY_COMMENTS})
		);
}
