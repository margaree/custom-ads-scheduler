import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { getLocalizeResources } from '../localization.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class DeliveryMethod extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			deliveryMethod: {
				type: String,
				attribute: 'delivery-method'
			},
			folder: {
				type: String,
				attribute: 'folder'
			},
			invalidDeliveryMethod: {
				type: Boolean
			},
			invalidFolder: {
				type: Boolean
			},
			errorText: {
				type: String
			}
		};
	}

	static get styles() {
		const selectDeliveryStyles = css`
			.step {
				margin: 20px 0px 60px 0;
			}

			.dm-input-wrapper {
				width: 500px;
				margin-bottom: 20px;
			}

			#delivery-method {
				width: 100%;
			}

			.one-line-tooltip {
				white-space: nowrap;
			}
		`;
		return [
			heading1Styles,
			inputStyles,
			selectStyles,
			inputLabelStyles,
			selectDeliveryStyles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this.deliveryMethod = null;
		this.folder = null;

		this.invalidDeliveryMethod = false;
		this.invalidFolder = false;
		this.errorText = '';
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Delivery Method</h1>
			${ this._renderStep() }
			<d2l-alert-toast id="invalid-properties" type="critical">
				${ this.errorText }
			</d2l-alert-toast>
		`;
	}

	validate() {
		this._validateDeliveryMethod();
		this._validateFolder();

		this.errorText = this.localize('step2.validation.prefix');

		const invalidProperties = [];
		if (this.invalidStartDate) invalidProperties.push(this.localize('step3.deliveryMethod.errorMessage'));
		if (this.invalidEndDate) invalidProperties.push(this.localize('step3.folder.errorMessage'));

		for (let i = 0; i < invalidProperties.length; i++) {
			this.errorText += `${ i === 0 ? ' ' : ', ' }${ invalidProperties[i] }`;
		}

		const invalid = this.invalidDeliveryMethod || this.invalidFolder;

		if (invalid) {
			this.shadowRoot.getElementById('invalid-properties').setAttribute('open', '');
		}

		return !this.invalidDeliveryMethod;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				deliveryTypeId: this.deliveryMethod,
				filePath: this.folder
			}
		});
		this.dispatchEvent(event);
	}

	_renderDeliveryMethod() {
		return html`
			<div class="dm-input-wrapper">
				<label for="delivery-method" class="d2l-input-label">${ this.localize('step3.deliveryMethod.label') } *</label>
				<select
					id="delivery-method"
					class="d2l-input-select"
					aria-invalid="${ this.invalidDeliveryMethod }"
					@change="${ this._scheduleDeliveryMethodChanged }">

					<option disabled selected value="">${ this.localize('step3.deliveryMethod.placeholder') }</option>			
					<option value='1' .selected="${ this.deliveryMethod === '1' }">${ this.localize('step3.deliveryType.BrightspaceFilePath') }</option>
		            <option value='2' .selected="${ this.deliveryMethod === '2' }">${ this.localize('step3.deliveryType.BrightspaceSFTP') }</option>
					<option value='3' .selected="${ this.deliveryMethod === '3' }">${ this.localize('step3.deliveryType.CustomSFTP') }</option>
				</select>
				${ this.invalidDeliveryMethod ? html`
				<d2l-tooltip for="delivery-method" state="error" align="start" class="one-line-tooltip">
					${ this.localize('step3.deliveryMethod.errorMessage') }
				</d2l-tooltip>` : null }
			</div>
		`;
	}

	_renderFolder() {
		return html`
			<div class="dm-input-wrapper">
				<d2l-input-text
					id="folder"
					label="${ this.localize('step3.folder.label') }"
					.value="${ this.folder }"
					aria-invalid="${ this.invalidFolder }"
					maxlength="2047"
					@change="${ this._scheduleFolderChanged }">
				</d2l-input-text>
				${ this.invalidFolder ? html`
				<d2l-tooltip for="folder" state="error" align="start">
					${ this.localize('step3.folder.errorMessage') } <br/>
					${ this.localize('step3.folder.invalidCharacters') }
				</d2l-tooltip>` : null }
			</div>
		`;
	}

	_renderStep() {
		return html`
			<div class="step">
				${ this._renderDeliveryMethod() }
				${ this._renderFolder() }
			</div>
		`;
	}

	_scheduleDeliveryMethodChanged(event) {
		this.deliveryMethod = event.target.value;
		this._validateDeliveryMethod();
		this._commitChanges();
	}

	_scheduleFolderChanged(event) {
		this.folder = event.target.value;
		this._validateFolder();
		this._commitChanges();
	}

	_validateDeliveryMethod() {
		this.invalidDeliveryMethod = this.deliveryMethod === null;
	}

	_validateFolder() {
		const invalidDirectoryCharacters = /[<>:"/\\|?*]/;
		this.invalidFolder = this.folder === null
			|| this.folder === undefined
			|| invalidDirectoryCharacters.test(this.folder);
	}
}

customElements.define('d2l-delivery-method', DeliveryMethod);
