import { Pipe } from "@angular/core";
import { StoreApp } from '../../models';

@Pipe({ name: "search" })
export class SearchPipe{
	transform(value, term) {
		if (value && term) {
			return value.filter( item => item.title.toUpperCase().includes(term.toUpperCase()) );
		} else {
			return value;
		}
	}
}