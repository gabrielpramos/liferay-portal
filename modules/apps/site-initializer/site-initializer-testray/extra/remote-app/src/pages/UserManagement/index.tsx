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

import ClayButton from '@clayui/button';
import ClayForm, {ClayCheckbox} from '@clayui/form';
import ClayLayout from '@clayui/layout';
import {useState} from 'react';

import {Avatar} from '../../components/Avatar';
import Input from '../../components/Input';
import InputFile from '../../components/Input/InputFile';
import Container from '../../components/Layout/Container';
import i18n from '../../i18n';
import {assignee} from '../../util/mock';

const UserManagement: React.FC = () => {
	const [{name, url}] = assignee;
	const [value, setValue] = useState(false);

	return (
		<ClayLayout.Container>
			<Container>
				<ClayForm>
					<ClayLayout.Row justify="start">
						<ClayLayout.Col size={3} sm={12} xl={3}>
							<h5 className="font-weight-normal">
								{i18n.translate('user-information')}
							</h5>
						</ClayLayout.Col>

						<ClayLayout.Col size={3} sm={12} xl={7}>
							<ClayForm.Group className="form-group-sm">
								<Input
									label={i18n.translate('first-name')}
									name="firstname"
									required
								/>

								<Input
									label={i18n.translate('last-name')}
									name="lastname"
									required
								/>

								<Input
									label={i18n.translate('email-address')}
									name="emailAddress"
									required
								/>

								<Input
									label={i18n.translate('screen-name')}
									name="screeName"
									required
								/>
							</ClayForm.Group>
						</ClayLayout.Col>
					</ClayLayout.Row>

					<hr />

					<ClayLayout.Row justify="start">
						<ClayLayout.Col size={3} sm={12} xl={3}>
							<h5 className="font-weight-normal">
								{i18n.translate('avatar')}
							</h5>
						</ClayLayout.Col>

						<ClayLayout.Col size={3} sm={12} xl={3}>
							<ClayForm.Group className="form-group-sm">
								<Avatar displayName name={name} url={url} />

								<br />

								<InputFile name="inputFile" required={false} />
							</ClayForm.Group>
						</ClayLayout.Col>
					</ClayLayout.Row>

					<hr />

					<ClayLayout.Row justify="start">
						<ClayLayout.Col size={3} sm={12} xl={3}>
							<h5 className="font-weight-normal">
								{i18n.translate('change-Password')}
							</h5>
						</ClayLayout.Col>

						<ClayLayout.Col size={3} sm={12} xl={3}>
							<ClayForm.Group className="form-group-sm">
								<ClayButton className="bg-neutral-2 borderless neutral text-neutral-7">
									{i18n.translate('change-password')}
								</ClayButton>
							</ClayForm.Group>
						</ClayLayout.Col>
					</ClayLayout.Row>

					<hr />

					<ClayLayout.Row justify="start">
						<ClayLayout.Col size={3} sm={12} xl={3}>
							<h5 className="font-weight-normal">
								{i18n.translate('roles')}
							</h5>
						</ClayLayout.Col>

						<ClayLayout.Col size={3} sm={12} xl={9}>
							<div>
								<div className="col-12">
									<ClayCheckbox
										checked={value}
										label={i18n.translate('testray-user')}
										onChange={() => setValue((val) => !val)}
									/>
								</div>

								<div className="col-12 ml-4 mt-2">
									<p>
										{i18n.translate(
											'this-role-is-for-general-liferay-employees-and-enables-authenticated-users-to-view-test-results'
										)}
									</p>
								</div>
							</div>

							<div>
								<div className="col-12">
									<ClayCheckbox
										checked={value}
										label="Testray Analyst"
										onChange={() => setValue((val) => !val)}
									/>
								</div>

								<div className="col-12 ml-4 mt-2">
									<p>
										{i18n.translate(
											'testers-carry-permissions-to-analyze-test-results-by-workflowing-results-or-collaborating-on-tasks'
										)}
									</p>
								</div>
							</div>

							<div>
								<div className="col-12">
									<ClayCheckbox
										checked={value}
										label="Testray Administrator"
										onChange={() => setValue((val) => !val)}
									/>
								</div>

								<div className="col-12 ml-4 mt-2">
									<p>
										{i18n.translate(
											'test-lead-should-only-have-access-to-builds-test-plans-test-suites-and-test-cases-.-this-role-will-be-responsible-for-creating-builds-and-for-creating-test-plans-test-runs-the-people-assigned-to-these-would-be-our-current-product-leads'
										)}
									</p>
								</div>
							</div>
						</ClayLayout.Col>
					</ClayLayout.Row>

					<ClayLayout.Row>
						<ClayLayout.Col>
							<ClayButton.Group
								className="form-group-sm mt-5"
								key={3}
								spaced
							>
								<ClayButton
									className="bg-primary-2 borderless mr-2 primary text-primary-7"
									displayType="primary"
								>
									{i18n.translate('save')}
								</ClayButton>

								<ClayButton
									className="bg-neutral-2 borderless neutral text-neutral-7"
									displayType="secondary"
								>
									{i18n.translate('cancel')}
								</ClayButton>
							</ClayButton.Group>
						</ClayLayout.Col>
					</ClayLayout.Row>
				</ClayForm>
			</Container>
		</ClayLayout.Container>
	);
};

export default UserManagement;
