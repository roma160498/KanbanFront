import { Component, OnInit, Input, ViewChild, Injector, ReflectiveInjector, Output, EventEmitter } from '@angular/core';
import { ItemTableComponent } from '../item-table/item-table.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { DateHelperService } from '../../../../services/date-helper.service';
import { ImageLoaderService } from '../../../../services/image-loader.service';

@Component({
	selector: 'app-item-page',
	templateUrl: './item-page.component.html',
	styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {

	@ViewChild('itemTable') tableComponent: ItemTableComponent;
	@ViewChild('itemForm') formComponent: ItemFormComponent;

	@Output() selectedRelatedItemToOpen: EventEmitter<any> = new EventEmitter();
	@Input() itemIdToOpen: any;

	_config: any;
	_properties: any[] = [];

	public isLoading: boolean = true;

	toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: false,
		isAddDisabled: false
	};
	selectedItems: any[];
	editMode: boolean = false;
	isTableDisplayed: boolean = true;
	userPermissions: any = {};

	updatedItem: any;

	serviceType: any;
	objectType: any;
	itemService: any;
	relatedServices: any = {};

	serviceIsLoaded: boolean = false;

	constructor(private inj: Injector, private dateHelper: DateHelperService, private imageService: ImageLoaderService) { }

	async ngOnInit() {
		this.userPermissions = JSON.parse(localStorage.getItem('permissions'));
		this._updateToolbarButtonsDisabledStates();
		const type = this.getConfigurationElement('typeName');
		await (async () => {
			const service = await import('../../../../services/' + type + '.service');
			this.serviceType = this._getTypeFromImportResult(service);
			const modelObject = await import('../../../../models/' + type);
			this.objectType = this._getTypeFromImportResult(modelObject);
	
			const tempInj = ReflectiveInjector.resolveAndCreate([this.serviceType], this.inj);
			this.itemService = tempInj.get(this.serviceType);

			const relatedServicesNames = this.getConfigurationElement('relatedServices') || [];
			for (let i = 0; i < relatedServicesNames.length; i++) {
				const name = relatedServicesNames[i];
				const relService = await import('../../../../services/' + name + '.service');
				const type = this._getTypeFromImportResult(relService);
				const tempRelInj = ReflectiveInjector.resolveAndCreate([type], this.inj);
				this.relatedServices[name] = tempRelInj.get(type); 
			}
			this.serviceIsLoaded = true;
			if (this.itemIdToOpen) {
				
			}
			setTimeout(() => {
				this.isLoading = false;
			}, 1000)
		})()
	}

	_getTypeFromImportResult(result) {
		return result[Object.keys(result)[0]];
	}

	setConfiguration(configuration) {
		this._config = configuration;
		this._properties = this._config.mainTableSettings.cols;
	}

	getConfigurationElement(name) {
		return this._config[name];
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const item = this.selectedItems[0];
			this._properties.forEach(prop => {
				const fieldName = prop.confirmOf || prop.field;
				switch (prop.type) {
					case 'calendar': 
						this.formComponent.ngModel[prop.field] = new Date(item[fieldName]);
						break;
					case 'progressBar':
						this.formComponent.ngModel[prop.field] = prop.getProgressBarValue(item);
						break;
					case 'imagePicker':
						debugger;
						prop.getImage(this.imageService, item).then(value => {
							this.formComponent.ngModel[prop.srcField] = value;
						}).catch(err => {
							if (err.name === 'no-pic') {
								this.formComponent.ngModel[prop.srcField] = '';// '../../../../assets/png/user-icon.png'
							}
						});
					default:
						this.formComponent.ngModel[prop.field] = item[fieldName]
				}
			});
			this.editMode = true;
		} else {
			this.editMode = false;
		}
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.formComponent.toolbarActionHandler(event,)
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedItemsOut(event) {
		this.selectedItems = event;
		this._updateToolbarButtonsDisabledStates();
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	updatedItemOut(event) {
		this.updatedItem = event;
	}

	_updateToolbarButtonsDisabledStates() {
		const pluralName:string = this.getConfigurationElement('pluralName');
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !this.userPermissions[pluralName].get || !this.userPermissions[pluralName].delete || !(this.selectedItems && this.selectedItems.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedItems && this.selectedItems.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: (!this.userPermissions[pluralName].create && !this.userPermissions[pluralName].update) || (!this.isTableDisplayed && this.editMode && !this.userPermissions[pluralName].update) || this.isTableDisplayed,
			isRefreshDisabled: !this.userPermissions[pluralName].get || !this.isTableDisplayed,
			isRowsDownDisabled: !this.userPermissions[pluralName].get || !this.isTableDisplayed,
			isAddDisabled: !this.userPermissions[pluralName].get || !this.userPermissions[pluralName].create || !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}

	selectedRelatedItemToOpenHandler(event) {
		debugger;
		this.selectedRelatedItemToOpen.emit(event);
	}
}
