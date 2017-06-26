import { Component, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ControlGroup, Control, FormBuilder, AbstractControl } from '@angular/common';
import { AppComponent } from '../../app.component';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';
import { AppWidgetsComponent } from '../appwidgets/appwidgets.component';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';


@Component({
    selector: 'search',
    directives: [RouterOutlet, RouterLink],
    styles: [require('./search.scss').toString(), require('../../../sass/typeimage.scss').toString()],
    template: require('./search.component.html')
})
export class SearchComponent {
    @Output() updateSearch = new EventEmitter();
    static router:Router;
    public filteredList = [];
    public query = '';
    public advancedSearchActive: boolean = false;
    private searchingForSuggestions: boolean = false;
    private activeOnly: boolean = true;

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

        this.searchterm.valueChanges
            .do((_) => {
                this.searchingForSuggestions = true;
            })
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(
                (res: any) => {
                       this.searchTermChanged(this.searchterm.value, this.activeOnly);
                }
            );
    }

	select(item){
      let isChannel = item.resourceids ? true : false;

      let url;
      if(isChannel){
        url = `/#/channel/${item.id}/`;
      } else {
        url = `/#/resource/${item.id}/`;
      }
      window.location.href = url;
	}

	searchTermChanged(searchTerm, activeOnly) {
        if(searchTerm.length>1) {
            this._appsService.getBySearch(searchTerm, this.freestuff._value, activeOnly)
                .subscribe(
                    filteredList => {
                        if(this.searchingForSuggestions) { // don't allow slow responses to overwrite
                            this.searchForChannels(searchTerm, filteredList.data);
                        }
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
        }else{
        	this.filteredList = [];
        }
    }

    searchForChannels(searchTerm, resourcesList) {
      this._appsService.getChannelsBySearch(searchTerm)
          .subscribe(
              filteredList => {
                  if(this.searchingForSuggestions) {
                      this.filteredList = filteredList.data.concat(resourcesList);
                      this.searchingForSuggestions = false;
                  }
              },
              (error:any) => AppComponent.generalError( error.status )
          );
    }


    onSubmitSearch(formValues: any) {
        SearchComponent.router.navigate( ['Results', { searchterm: encodeURIComponent(this.searchterm._value) }] );
    }

    hideOptions(){
        //setTimeout(() => {
        //  this.filteredList = [];
        //}, 300);
    }

    itemTypeClass(item):string {
      var type = item.type_id;
      if(type==99){
          type = 'other';
      }
      if(type === undefined){
        type = '-channel';
      }
      return 'backgroundimage' + type;
    }

    toggleAdvancedSearch() {
        let isActive = this.advancedSearchActive;
        this.advancedSearchActive = isActive ? false : true;

        this.clearAdvancedOptions();
    }

    clearAdvancedOptions() {

        (<Control>this.freestuff).updateValue(false);


    }

    shortTitle(appTitle: String) {
       return (appTitle.length>80) ? (appTitle.substr(0, 80)+'...') : appTitle;
    }

    shortDescription(appDescription: String) {
  	   return (appDescription.length>110) ? (appDescription.substr(0, 110)+'...') : appDescription;
    }
}
