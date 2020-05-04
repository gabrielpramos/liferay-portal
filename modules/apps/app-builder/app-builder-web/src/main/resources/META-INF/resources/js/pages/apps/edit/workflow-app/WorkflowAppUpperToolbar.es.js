/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {DataLayoutBuilderActions} from 'data-engine-taglib';
import React, {useContext, useState} from 'react';

import {AppContext} from '../../../../AppContext.es';
import TranslationManager from '../../../../components/translation-manager/TranslationManager.es';
import UpperToolbar from '../../../../components/upper-toolbar/UpperToolbar.es';
import FormViewContext from '../../../form-view/FormViewContext.es';

export default () => {
	const [state, dispatch] = useContext(FormViewContext);
	const {dataLayout} = state;

	const [editingLanguageId, setEditingLanguageId] = useState(
		Liferay.ThemeDisplay.getLanguageId()
	);

	const {basePortletURL} = useContext(AppContext);

	const listUrl = `${basePortletURL}/#/apps`;

	const onCancel = () => {
		Liferay.Util.navigate(listUrl);
	};

	const onInput = ({target}) => {
		const {value} = target;

		dispatch({
			payload: {
				name: {
					...dataLayout.name,
					[editingLanguageId]: value,
				},
			},
			type: DataLayoutBuilderActions.UPDATE_DATA_LAYOUT_NAME,
		});
	};

	const onKeyDown = (event) => {
		if (event.keyCode === 13) {
			event.preventDefault();

			event.target.blur();
		}
	};

	const onDeploy = () => {};

	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

	const {
		name: {
			[defaultLanguageId]: dataLayoutDefaultName,
			[editingLanguageId]: dataLayoutEditingName,
		},
	} = dataLayout;

	return (
		<UpperToolbar>
			<UpperToolbar.Group>
				<TranslationManager
					editingLanguageId={editingLanguageId}
					onChangeLanguageId={(languageId) =>
						setEditingLanguageId(languageId)
					}
					translatedLanguageIds={dataLayout.name}
				/>
			</UpperToolbar.Group>

			<UpperToolbar.Input
				onInput={onInput}
				onKeyDown={onKeyDown}
				placeholder={Liferay.Language.get(
					'untitled-workflow-powered-app'
				)}
				value={dataLayoutEditingName}
			/>

			<UpperToolbar.Group>
				<UpperToolbar.Button displayType="secondary" onClick={onCancel}>
					{Liferay.Language.get('cancel')}
				</UpperToolbar.Button>

				<UpperToolbar.Button
					disabled={!dataLayoutEditingName || !dataLayoutDefaultName}
					onClick={onDeploy}
				>
					{Liferay.Language.get('deploy')}
				</UpperToolbar.Button>
			</UpperToolbar.Group>
		</UpperToolbar>
	);
};
