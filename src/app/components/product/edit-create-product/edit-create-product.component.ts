import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
  
  userCols: any;
  allRelatedCols: any;
  
  @Output() updatedProductOut: EventEmitter<any> = new EventEmitter();
	@Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
  constructor(private productService: ProductService, private messageService: MessageService) { }
  ngOnInit() {
	// this.allRelatedCols = [
	// 	{ field: 'name', header: 'Name' },
	// 	{ field: 'surname', header: 'Surname' },
	// 	{ field: 'login', header: 'Login' },
	// 	{ field: 'email', header: 'Email'},
	// 	{ field: 'roleName', header: 'Role', service: this.roleService}
	// ];
	this.userCols = [
		{field: 'name', header: 'Name' },
		{ field: 'surname', header: 'Surname' },
		{ field: 'login', header: 'Login' },
		{ field: 'email', header: 'Email'},
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
				this.productService.updateProduct(product, this.selectedProduct.id).subscribe((result)=>{
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
