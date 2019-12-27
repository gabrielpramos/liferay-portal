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

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState
} from 'react';

import {usePatch} from '../../../../shared/hooks/usePatch.es';
import {sub} from '../../../../shared/util/lang.es';
import {BulkReassignSelectAssigneesStep} from './select-assignees-step/BulkReassignSelectAssigneesStep.es';
import {BulkReassignSelectTasksStep} from './select-tasks-step/BulkReassignSelectTasksStep.es';

const BulkReassignModalContext = createContext();

const BulkReassignModal = () => {
	const {bulkReassignData, setBulkReassignData} = useContext(
		BulkReassignModalContext
	);

	const {
		reassignedTasks,
		reassigning,
		selectedTasks,
		visible
	} = bulkReassignData;

	const [currentStep, setCurrentStep] = useState('selectTasks');
	const [errorToast, setErrorToast] = useState(null);
	const [successToast, setSuccessToast] = useState([]);

	const {observer, onClose} = useModal({
		onClose: () => {
			setBulkReassignData({
				reassignedTasks: [],
				reassigning: false,
				selectedAssignee: null,
				selectedTasks: [],
				useSameAssignee: false,
				visible: false
			});

			setCurrentStep('selectTasks');

			setErrorToast(false);
		}
	});

	const {patchData} = usePatch({
		body: reassignedTasks,
		headless: true,
		url: 'workflow-tasks/assign-to-user/batch'
	});

	const handleReassign = useCallback(() => {
		if (
			reassignedTasks.length > 0 &&
			reassignedTasks.length === selectedTasks.length
		) {
			setBulkReassignData({
				...bulkReassignData,
				reassigning: true
			});

			setErrorToast(false);

			patchData()
				.then(() => {
					onClose();

					setSuccessToast([
						...successToast,
						Liferay.Language.get('these-tasks-have-been-reassigned')
					]);
				})
				.catch(() => {
					const error = `${Liferay.Language.get(
						'your-connection-was-unexpectedly-lost'
					)} ${Liferay.Language.get('select-reassign-to-retry')}`;

					setBulkReassignData({
						...bulkReassignData,
						reassigning: false
					});

					setErrorToast(error);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [patchData]);

	const getStep = useCallback(
		step => {
			const steps = {
				selectAssignees: {
					component: BulkReassignSelectAssigneesStep,
					nextBtn: {
						disabled:
							reassignedTasks.length !== selectedTasks.length,
						handle: handleReassign,
						text: Liferay.Language.get('reassign')
					},
					order: 2,
					previousBtn: true,
					subtitle: Liferay.Language.get('select-assignees'),
					title: Liferay.Language.get('select-new-assignees')
				},
				selectTasks: {
					component: BulkReassignSelectTasksStep,
					nextBtn: {
						disabled: selectedTasks.length === 0,
						handle: () => setCurrentStep('selectAssignees'),
						text: Liferay.Language.get('next')
					},
					order: 1,
					previousBtn: false,
					subtitle: Liferay.Language.get('select-tasks'),
					title: Liferay.Language.get('select-tasks-to-reassign')
				}
			};

			return steps[step];
		},
		[handleReassign, reassignedTasks.length, selectedTasks.length]
	);

	const step = useMemo(() => getStep(currentStep), [currentStep, getStep]);

	const handlePrevious = () => {
		setBulkReassignData({
			...bulkReassignData,
			reassignedTasks: [],
			reassigning: false,
			selectedAssignee: null,
			useSameAssignee: false
		});
		setCurrentStep('selectTasks');
		setErrorToast(false);
	};

	const spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/lexicon/icons.svg`;

	return (
		<>
			<ClayAlert.ToastContainer>
				{successToast.map((message, index) => (
					<ClayAlert
						autoClose={5000}
						displayType={'success'}
						key={index}
						onClose={() => {
							setSuccessToast(prevItems =>
								prevItems.filter(item => item !== message)
							);
						}}
						spritemap={spritemap}
						title={Liferay.Language.get('success')}
					>
						{message}
					</ClayAlert>
				))}
			</ClayAlert.ToastContainer>

			{visible && (
				<ClayModal
					data-testid="bulkReassignModal"
					observer={observer}
					size="lg"
					spritemap={spritemap}
				>
					<ClayModal.Header>{step.title}</ClayModal.Header>

					{errorToast && (
						<ClayAlert
							className="mb-0"
							displayType="danger"
							spritemap={spritemap}
							title={Liferay.Language.get('error')}
						>
							{errorToast}
						</ClayAlert>
					)}

					<StepsOfBar
						current={step.order}
						title={step.subtitle}
						total={2}
					/>

					{<step.component setErrorToast={setErrorToast} />}

					<ClayModal.Footer
						first={
							<ClayButton
								data-testid="cancelButton"
								disabled={reassigning}
								displayType="secondary"
								onClick={onClose}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>
						}
						last={
							<>
								{step.previousBtn && (
									<ClayButton
										className="mr-3"
										disabled={reassigning}
										displayType="secondary"
										onClick={handlePrevious}
									>
										{Liferay.Language.get('previous')}
									</ClayButton>
								)}

								<ClayButton
									data-testid="nextButton"
									disabled={
										reassigning || step.nextBtn.disabled
									}
									onClick={step.nextBtn.handle}
								>
									{step.nextBtn.text}
								</ClayButton>
							</>
						}
					/>
				</ClayModal>
			)}
		</>
	);
};

const StepsOfBar = ({current, title, total}) => {
	return (
		<div className="step-of-bar">
			<small>{title}</small>
			<small>
				{sub(Liferay.Language.get('step-x-of-x'), [current, total])}
			</small>
		</div>
	);
};

export {BulkReassignModal, BulkReassignModalContext};
