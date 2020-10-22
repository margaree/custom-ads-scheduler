import '@brightspace-ui/core/components/alert/alert-toast';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui-labs/role-selector/role-item.js';
import '@brightspace-ui-labs/role-selector/role-selector.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { getLocalizeResources } from '../localization.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class SelectDataSet extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleName: {
				type: String,
				attribute: 'schedule-name'
			},
			dataSetOptions: {
				type: Array,
				attribute: 'data-set-options'
			},
			dataSet: {
				type: String,
				attribute: 'data-set'
			},
			orgUnitId: {
				type: String,
				attribute: 'org-unit-id'
			},
			roleItems: {
				type: Array,
				attribute: 'role-items'
			},
			rolesSelected: {
				type: Array,
				attribute: 'roles-selected'
			},
			invalidScheduleName: {
				type: Boolean
			},
			invalidDataSet: {
				type: Boolean
			},
			errorText: {
				type: String
			}
		};
	}

	static get styles() {
		const selectDataSetStyles = css`
			.step {
				margin: 20px 0px 60px 0;
			}

			.sds-input-wrapper {
				width: 500px;
				margin-bottom: 20px;
			}

			#advanced-data-set {
				width: 100%;
			}
		`;
		return [
			heading1Styles,
			inputStyles,
			selectStyles,
			inputLabelStyles,
			selectDataSetStyles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();

		this.scheduleName = null;
		this.dataSetOptions = [];
		this.dataSet = null;
		this.orgUnitId = null;
		this.roleItems = [];
		this.rolesSelected = [];

		this.invalidScheduleName = false;
		this.invalidDataSet = false;
		this.errorText = '';
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Select Your Advanced Data Set</h1>
			${ this._renderStep() }
			<d2l-alert-toast id="invalid-properties" type="critical">
				${ this.errorText }
			</d2l-alert-toast>
		`;
	}

	validate() {
		this._validateScheduleName();
		this._validateDataSet();

		this.errorText = this.localize('step1.validation.prefix');
		if (this.invalidScheduleName) {
			this.errorText += ` ${this.localize('step1.scheduleName.label')}`;
		}
		if (this.invalidDataSet) {
			this.errorText += `${this.invalidScheduleName ? ',' : ''} ${this.localize('step1.ads.label')}`;
		}

		const invalid = this.invalidScheduleName || this.invalidDataSet;
		if (invalid) {
			this.shadowRoot.getElementById('invalid-properties').setAttribute('open', '');
		}
		return !invalid;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				name: this.scheduleName,
				dataSetId: this.dataSet,
				orgUnitId: this.orgUnitId,
				roleIds: this.rolesSelected
			}
		});
		this.dispatchEvent(event);
	}

	_renderAdvancedDataSet() {
		return html`
			<div class="sds-input-wrapper">
				<label for="advanced-data-set" class="d2l-input-label">${ this.localize('step1.ads.label') } *</label>
				<select
					id="advanced-data-set"
					class="d2l-input-select"
					@change="${ this._selectedDataSetChanged }"
					aria-invalid="${ this.invalidDataSet }">
					<option disabled selected value="">${ this.localize('step1.ads.placeholder') }</option>
					${ this.dataSetOptions.map(option => this._renderAdvancedDataSetOption(option)) }
				</select>
			</div>
		`;
	}

	_renderAdvancedDataSetOption(option) {
		return html`
			<option value=${ option.DataSetId } .selected="${ option.DataSetId === this.dataSet }">${ option.Name }</option>
		`;
	}

	_renderOrgUnitId() {
		return html`
			<div class="sds-input-wrapper">
				<d2l-input-text
					label="${ this.localize('step1.OrgUnitId.label') }"
					placeholder="${ this.localize('step1.OrgUnitId.placeholder') }"
					.value="${ this.orgUnitId }"
					@change="${ this._scheduleOrgUnitIdChanged }">
				</d2l-input-text>
			</div>
		`;
	}

	_renderRoleItems(role, roleList) {
		if (roleList.includes(role.Identifier)) {
			return html`
				<d2l-labs-role-item item-id="${ role.Identifier }" display-name="${ role.DisplayName }" selected></d2l-labs-role-item>
			`;
		}

		return html`
			<d2l-labs-role-item item-id="${ role.Identifier }" display-name="${ role.DisplayName }"></d2l-labs-role-item>
		`;
	}

	_renderScheduleName() {
		return html`
			<div class="sds-input-wrapper">
				<d2l-input-text
					aria-invalid="${ this.invalidScheduleName }"
					label="${ this.localize('step1.scheduleName.label') } *"
					placeholder="${ this.localize('step1.scheduleName.placeholder') }"
					.value="${ this.scheduleName }"
					@change="${ this._scheduleNameChanged }">
				</d2l-input-text>
			</div>
		`;
	}

	_renderSelectRoles() {
		const roleList = this.rolesSelected.toString().split(',');

		return html`
			<d2l-labs-role-selector
				@d2l-labs-role-selected="${ this._scheduleRolesChanged }">
				${ this.roleItems.map(role => this._renderRoleItems(role, roleList)) }
			</d2l-labs-role-selector>
		`;
	}

	_renderStep() {
		return html`
			<div class="step">
				${ this._renderScheduleName() }
				${ this._renderAdvancedDataSet() }
				${ this._renderOrgUnitId() }
				${ this._renderSelectRoles() }
			</div>
		`;
	}

	_scheduleNameChanged(event) {
		this.scheduleName = event.target.value;
		this._validateScheduleName();
		this._commitChanges();
	}

	_scheduleOrgUnitIdChanged(event) {
		this.orgUnitId = event.target.value;
		this._commitChanges();
	}

	_scheduleRolesChanged(event) {
		this.rolesSelected = event.detail.rolesSelected;
		this._commitChanges();
	}

	_selectedDataSetChanged(event) {
		this.dataSet = event.target.value;
		this._validateDataSet();
		this._commitChanges();
	}

	_validateDataSet() {
		this.invalidDataSet = this.dataSet === null;
	}

	_validateScheduleName() {
		// TODO: Max char check
		this.invalidScheduleName = this.scheduleName === ''
			|| this.scheduleName === null
			|| this.scheduleName === undefined;
	}
}

customElements.define('d2l-select-data-set', SelectDataSet);
