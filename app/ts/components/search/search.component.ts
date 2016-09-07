import { Component, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ControlGroup, Control, FormBuilder, AbstractControl } from '@angular/common';
import { AppComponent } from '../../app.component';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';
import { AppWidgetsComponent } from '../appwidgets/appwidgets.component';

@Component({
    selector: 'search',
    directives: [RouterOutlet, RouterLink],
    styles: [require('./search.scss').toString()],
    template: require('./search.component.html')
})
export class SearchComponent {
    @Output() updateSearch = new EventEmitter();
    static router:Router;
    public filteredList = [];
	public query = '';
    public advancedSearchActive: boolean = false;

    private resultsApps:Array<StoreApp>;

    searchForm: ControlGroup;
    freestuff: AbstractControl;
    searchterm: AbstractControl;

 
    constructor( private _appsService:AppsService,
                 fb: FormBuilder,
                 router:Router ) {


         SearchComponent.router = router;

        this.searchForm = fb.group({
                "freestuff": [""],
                "searchterm": [""],
                "ratings": [""]
            });

        this.searchterm = this.searchForm.controls['searchterm'];

        this.freestuff = this.searchForm.controls['freestuff'];

    }

	select(item){
    	this.query = item.title;
    	this.filteredList = [];
    	var url = `/#/resource/${item.id}/`;
        window.location.href = url;
	}

	searchTermChanged(searchTerm) {
        if(searchTerm.length>1) {
            this._appsService.getBySearch(searchTerm, this.freestuff._value)
                .subscribe(
                    filteredList => {
                        this.filteredList = filteredList.data;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
        }else{
        	this.filteredList = [];
        }
    }

    onSubmitSearch(formValues: any) {
        SearchComponent.router.navigate( ['Results', { searchterm: encodeURIComponent(this.searchterm._value) }] );
    }

    hideOptions(){
        //setTimeout(() => {
        //  this.filteredList = [];
        //}, 300);
    }

    itemimage(item):string {
        if(!item.image) {
            var type = item.type_id;
            if(type==99){
                type = 'other';
            }
            return 'https://s3-eu-west-1.amazonaws.com/jisc-store-assets/type' + type + '.png';
        } 
        return item.image;
    }

    toggleAdvancedSearch() {
        let isActive = this.advancedSearchActive;
        this.advancedSearchActive = isActive ? false : true;

        this.clearAdvancedOptions();
    }

    clearAdvancedOptions() {

        (<Control>this.freestuff).updateValue(false);
    

    }
}