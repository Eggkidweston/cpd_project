import { Component, Output, EventEmitter, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AppComponent } from '../../app.component';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';

@Component({
    selector: 'search',
    directives: [RouterOutlet, RouterLink],
    styles: [require('./search.scss').toString()],
    template: require('./search.component.html')
})
export class SearchComponent {
    @Output() updateSearch = new EventEmitter();

    public filteredList = [];
	public query = '';
	public elementRef;
 
    constructor(myElement: ElementRef, private _appsService:AppsService) {
        this.elementRef = myElement;
    }
	
	select(item){
    	this.query = item.title;
    	this.filteredList = [];
    	var url = `/#/resource/${item.id}/`;
        window.location.href = url;
	}

	searchTermChanged(searchTerm) {
        if(searchTerm.length>1) {
            this._appsService.getBySearchTerm( searchTerm)
                .subscribe(
                    filteredList => {
                        this.filteredList = filteredList;
                        
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
        }else{
        	this.filteredList = [];
        }
    }
}