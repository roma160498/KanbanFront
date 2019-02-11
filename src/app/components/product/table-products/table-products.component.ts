import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef, SimpleChange } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { TableModule } from 'primeng/table';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';

@Component({
	selector: 'app-table-products',
	templateUrl: './table-products.component.html',
	styleUrls: ['./table-products.component.css'],
	providers: [MessageService]
})
export class TableProductsComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedProductsOut: EventEmitter<Product[]> = new EventEmitter();
	@Input() updatedProduct: any;
	@Input() canGet: boolean;

	amountOfProducts: number = 0;
	cols: any[];
	products: Product[] = [];
	scrollHeight: string;
	selectedProducts: Product[];
	selectedProduct: Product;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;
	
	constructor(private productService: ProductService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'name', header: 'Name' },
			{ field: 'description', header: 'Description' }
		];
		this.getProducts();
	}

	getProducts() {
		if (this.canGet) {
			this.productService.getProduct({}).subscribe(products => {
				this.amountOfProducts = products.length;
				this.products = products;
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfProducts : amount;
	}

	toolbarActionHandler(action, table) {
		switch (action) {
			case 'delete': {
				this._deleteItem(table);
				break;
			}
			case 'refresh': {
				this._refreshGrid(table);
				break;
			}
			case 'add': {
				break;
			}
			case 'save': {
				this.selectedProducts = [];
				this.selectedProductsOut.emit(this.selectedProducts);
				break;
			}
			case 'filter': {
				this.searchIsVisible = !this.searchIsVisible;
				if (!this.searchIsVisible) {
					this.clearFilterInputs();
				}
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedProduct']) {
			const product = changes['updatedProduct'];
			if (product.currentValue && product.currentValue.isNew) {
				this.products.push(product.currentValue.product);
				this.amountOfProducts++;
				this.resetTable();
				const name = product.currentValue.product.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} created successfully.` });
			}
			if (product.currentValue && !product.currentValue.isNew) {
				const updatedProduct = this.products.find((value, index) => product.currentValue.productID == value.id);
				for (let key of Object.keys(product.currentValue.updatedProps)) {
					updatedProduct[key] = product.currentValue.updatedProps[key];
				}
				this.resetTable();
				const name = product.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedProductsOut.emit(this.selectedProducts);
	}

	_refreshGrid(table) {
		this.getProducts();
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedProducts.length; i++) {
			const arrayIndex = this.products.indexOf(this.selectedProducts[i]);
			this.products = this.products.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedProducts[i].id;
			this.amountOfProducts--;
			this.selectedProducts
			const name = this.selectedProducts[i].name;
			this.productService.deleteProduct({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedProducts = [];
		this.selectedProductsOut.emit(this.selectedProducts);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} deleted successfully.` });
	}

	resetTable() {
		this.table['__proto__'].reset.call(this.table);
		this.clearFilterInputs();
	}

	clearFilterInputs() {
		const filters = document.getElementsByClassName('filterInput');
		for (let i = 0; i < filters.length; i++) {
			(<HTMLInputElement>filters[i]).value = '';
			this.table['__proto__'].filter.call(this.table, '', this.cols[i].field);
		}
	}
}
