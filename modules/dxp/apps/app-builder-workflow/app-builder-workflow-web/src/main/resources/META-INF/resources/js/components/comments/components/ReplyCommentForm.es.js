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

import ClayButton from '@clayui/button';
import {openToast} from 'frontend-js-web';
import React, {useContext, useState} from 'react';

import {CommentsContext} from '../store/context.es';
import {addEntryComment} from '../store/thunks.es';
import CommentForm from './CommentForm.es';

export default function ReplyCommentForm({disabled, entryId, parentCommentId}) {
	const [, dispatch] = useContext(CommentsContext);

	const [addingComment, setAddingComment] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [commentText, setCommentText] = useState('');

	const onSubmit = () => {
		setAddingComment(true);

		dispatch(addEntryComment({body: commentText, entryId, parentCommentId}))
			.then(() => {
				setAddingComment(false);
				setShowForm(false);
				setCommentText('');
			})
			.catch(() => {
				openToast({
					message: Liferay.Language.get(
						'the-reply-could-not-be-saved'
					),
					type: 'danger',
				});

				setAddingComment(false);
			});
	};

	return (
		<div className="mr-3 pb-2">
			{showForm ? (
				<CommentForm
					autoFocus
					commentText={commentText}
					loading={addingComment}
					onCancel={() => {
						setShowForm(false);
						setCommentText('');
					}}
					onChange={setCommentText}
					onSubmit={onSubmit}
					showButtons
					submitLabel={Liferay.Language.get('reply')}
				/>
			) : (
				<ClayButton
					borderless
					className="border-0"
					disabled={disabled}
					displayType="secondary"
					onClick={() => setShowForm(true)}
					small
				>
					{Liferay.Language.get('reply')}
				</ClayButton>
			)}
		</div>
	);
}
