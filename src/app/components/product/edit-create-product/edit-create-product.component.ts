import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { ProductService } from '../../../services/product.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-edit-create-product',
	templateUrl: './edit-create-product.component.html',
	styleUrls: ['./edit-create-product.component.css'],
	providers: [MessageService]
})
export class EditCreateProductComponent implements OnInit {
	selectedProduct: Product;
	id: number;
	name: string = '';
	description: string = '';
	selectedProducts: Product[];
	editMode: string;
	@ViewChild('relationTable') relTableComponent: RelationshipTableComponent;
	@Input() relationshipPermissions: any;

	featureCols: any;
	incrementCols: any;
	allRelatedCols: any;

	@Output() updatedProductOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
	constructor(private productService: ProductService, private messageService: MessageService) { }
	ngOnInit() {
		this.allRelatedCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'acc_criteria', header: 'Acception criteria' },
			{ field: 'creator_name', header: 'Creator' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'type_name', header: 'Classification' },
			{ field: 'created_on', header: 'Created' },
			{ field: 'modified_on', header: 'Modified' },
			{ field: 'closed_on', header: 'Closed' }
		];
		this.featureCols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' },
			{ field: 'acc_criteria', header: 'Acception criteria' },
			{ field: 'creator_name', header: 'Creator' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'type_name', header: 'Classification' },
			{ field: 'status_name', header: 'Status' },
			{ field: 'created_on', header: 'Created' },
			{ field: 'modified_on', header: 'Modified' },
			{ field: 'closed_on', header: 'Closed' }
		];
		this.incrementCols = [
			{ field: 'number', header: 'Number' },
			{ field: 'name', header: 'Name' },
			{ field: 'start_date', header: 'Started On' },
			{ field: 'end_date', header: 'Ended On' },
			{ field: 'status_name', header: 'Status' }
		];
	}
	toolbarActionHandler(action) {
		const product = new Product();
		if (action === 'save') {
			if (this._isInputDataInvalid()) {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
				return;
			}
			if (this.editMode === 'add') {
				product.name = this.name;
				product.description = this.description;
				this.productService.insertProduct(product).subscribe((result) => {
					if (result) {
						this.updatedProductOut.emit({
							isNew: true,
							product: product
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Product with ${this.name} name can not be created.` });
					}
				})
			} else if (this.editMode === 'edit') {

				for (let key in this.selectedProduct) {
					if (this[key] !== this.selectedProduct[key] && key != 'id') {
						product[key] = this[key]
					}
				}
				this.productService.updateProduct(product, this.selectedProduct.id).subscribe((result) => {
					if (result) {
						this.updatedProductOut.emit({
							isNew: false,
							productID: this.selectedProduct.id,
							updatedProps: product
						});
						this.isSavedResultSuccesOut.emit(true);
						this._clearForm();
					} else {
						this.isSavedResultSuccesOut.emit(false);
						this.messageService.add({ severity: 'error', summary: 'Error', detail: `Product with ${this.name} name can not be updated.` });
					}
				})
			}
			this.editMode === action;
		}

		if (action === 'add' || action === 'edit') {
			this.editMode = action;
		}
	}

	_isInputDataInvalid() {
		return this.name === '';
	}

	_clearForm() {
		this.name = '';
		this.description = '';
		this.selectedProduct = null;
	}

	discard() {
		this._clearForm();
		this.isSavedResultSuccesOut.emit(true);
		this.editMode = null;
	}

	splitterMove(event) {
		console.log(event)
	}
}
