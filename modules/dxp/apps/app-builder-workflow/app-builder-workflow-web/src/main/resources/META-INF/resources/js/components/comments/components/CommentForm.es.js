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
import {ClayInput} from '@clayui/form';
import React from 'react';

export default function CommentForm({
	autoFocus = false,
	commentText,
	loading = false,
	onCancel,
	onChange,
	onFocus = () => {},
	onSubmit,
	showButtons = false,
	submitLabel,
}) {
	return (
		<form onFocus={onFocus} onSubmit={onSubmit}>
			<fieldset disabled={loading}>
				<div className="form-group form-group-sm">
					<label className="sr-only">
						{Liferay.Language.get('add-comment')}
					</label>

					<ClayInput
						autoFocus={autoFocus}
						onChange={({target}) => onChange(target.value)}
						placeholder={Liferay.Language.get(
							'type-your-comment-here'
						)}
						value={commentText}
					/>
				</div>

				{showButtons && (
					<ClayButton.Group className="mb-3" spaced>
						<ClayButton
							disabled={!commentText}
							displayType="primary"
							loading={loading}
							onClick={onSubmit}
							small
						>
							{submitLabel}
						</ClayButton>

						<ClayButton
							displayType="secondary"
							onClick={onCancel}
							small
							type="button"
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>
					</ClayButton.Group>
				)}
			</fieldset>
		</form>
	);
}
