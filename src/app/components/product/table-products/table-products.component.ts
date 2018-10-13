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
  
  amountOfProducts: number;
	cols: any[];
	products: Product[];
	loading: boolean;
	scrollHeight: string;
	selectedProducts: Product[];
	selectedProduct: Product;
	rowsAmount: number = 25;
  isTableDisplayed: boolean = true;
  
  constructor(private productService: ProductService, private el: ElementRef, private messageService: MessageService) { }

  ngOnInit() {
    console.log(12)
    this.productService.getProductCount({}).subscribe(res => {
      this.amountOfProducts = res[0]['sum'];
      console.log(this.amountOfProducts)
		});
		this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' }
		];
		this.loading = true;
  }

  _isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	onResize(event) {
		/*this.scrollHeight = this.el.nativeElement.getElementsByTagName('p-table')[0].firstElementChild.offsetHeight - 70 + 'px';
		const header: HTMLElement = <HTMLElement>document.getElementsByClassName('ui-table-scrollable-header')[0];
		if (this._isScrollExist(this.el.nativeElement.getElementsByClassName('ui-table-scrollable-body-table')[0])) {
			header.style.marginRight = '17px';
		} else {
			header.style.marginRight = '0px';
		}*/
	}

  rowsAmountChangeHandler(amount, aaa) {
		this.table['__proto__'].reset.call(this.table);
		this.rowsAmount = amount === -1 ? this.amountOfProducts : amount;
		this.loadProductsLazy({
			first: 0,
			rows: this.rowsAmount
		});
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
		}
	}

	ngOnChanges(changes: SimpleChange) {

		console.log(changes['updatedProduct'])
		if (changes['updatedProduct']) {
			const product = changes['updatedProduct'];
			if (product.currentValue && product.currentValue.isNew) {
				this.products.push(product.currentValue.product);
				this.amountOfProducts++;
				this.table['__proto__'].reset.call(this.table);
				const name = product.currentValue.product.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} created successfully.` });
			}
			if (product.currentValue && !product.currentValue.isNew) {
				console.log("UPDSTE")
				const updatedProduct = this.products.find((value, index) => product.currentValue.productID == value.id);
				for (let key of Object.keys(product.currentValue.updatedProps)) {
					updatedProduct[key] = product.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				console.log(product.currentValue)
				const name = product.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		console.log(this.selectedProducts)
		this.selectedProductsOut.emit(this.selectedProducts);
	}

	_refreshGrid(table) {
		this.productService.getProductCount({}).subscribe(res => {
			this.amountOfProducts = res[0]['sum'];
		});
		this.loading = true;
		this.loadProductsLazy({
			first: table.first,
			rows: this.rowsAmount
		});
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
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedProducts = [];
		this.selectedProductsOut.emit(this.selectedProducts);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${name} deleted successfully.` });
	}

	loadProductsLazy(event) {
		this.loading = true;
		this.productService.getProduct({
			offset: event.first,
			amount: event.rows
		}).subscribe(products => {
			this.products = products;
			this.loading = false;
			this.onResize({});
		});
	}
}
