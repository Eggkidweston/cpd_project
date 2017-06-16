import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, TagCloud, Tag, Channel } from '../../../models';
import { AppComponent } from '../../../app.component';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';

@Component({
    selector: 'submit-channel',
    template: require('submit-channel.component.html'),
    styles: [require('../../../../sass/explore.scss').toString(),
      require('../../search/search.scss').toString(),
      require('./submit-channel.component.scss').toString()],
    directives: [AppWidgetsComponent]
})
export class SubmitChannelComponent {
    @Output() channelAdded: EventEmitter<Channel> = new EventEmitter<Channel>();
    public searchResults = [];
    public channelApps:Array<StoreApp> = [];
    public usersChannels:Array<Channel> = [];

    private resourceIds = [];
    private searchingForResources: boolean = false;
    private activeOnly: boolean = true;
    private editingChannel: boolean = false;
    private editingChannelID: number;

    newChannelForm: ControlGroup;
    channelTitle: AbstractControl;
    channelDescription: AbstractControl;
    searchterm: AbstractControl;

    busy: boolean = false;
    channelId: number = 1;

    constructor(private appsService: AppsService, private fb: FormBuilder) {
        this.createForm();
    }

    createForm(title?, description?) {
      this.newChannelForm = this.fb.group({
          "channelTitle": [title, Validators.required],
          "channelDescription": [description, Validators.required],
          "searchterm": [""],
      });

      this.channelTitle = this.newChannelForm.controls['channelTitle'];
      this.channelDescription = this.newChannelForm.controls['channelDescription'];
      this.searchterm = this.newChannelForm.controls['searchterm'];

      this.searchterm.valueChanges
          .do((_) => {
            this.searchingForResources = true;
          })
          .debounceTime(500)
          .distinctUntilChanged()
          .subscribe(
              (res: any) => {
                  this.searchTermChanged(this.searchterm.value, this.activeOnly);
              }
          );
    }

    ngAfterViewInit() {
        this.loadExistingChannels();
    }

    loadExistingChannels()
    {
        this.appsService.getChannelsByCreator( AuthenticationService.user.id )
            .subscribe(
                usersChannels => {
                    this.usersChannels = usersChannels;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    onSubmit(formVaules: any) {
        if( this.newChannelForm.valid ) {
            this.busy = true;
            let channel = new Channel(this.channelTitle.value, this.channelDescription.value, this.resourceIds, null);

            this.appsService.submitChannel(channel,
                (result) => {
                    this.busy = false;
                    this.channelAdded.emit(result.channel);
                    this.usersChannels.push(result.channel);
                    this.resetForm();
                },
                (err) => {
                    this.busy = false;
                }
            );
        }
    }

    updateChannel(e){
        e.preventDefault()

        if( this.newChannelForm.valid ) {
            this.busy = true;
            let channel = new Channel(this.channelTitle.value, this.channelDescription.value, this.resourceIds, null);
            this.appsService.updateChannel(this.editingChannelID, channel,
                (result) => {
                    this.busy = false;
                    this.editingChannel = false;
                    this.channelAdded.emit(result.channel);
                    this.loadExistingChannels();
                    this.resetForm();
                },
                (err) => {
                    this.busy = false;
                }
            );
        }
    }

    cancelUpdate(e){
        e.preventDefault();
        this.editingChannel = false;
        this.editingChannelID = null;
        this.resetForm();
    }

    deleteChannel(channel: Channel){
        this.appsService.deleteChannel( channel.id,
            (status) => {
                let index = this.usersChannels.indexOf(channel);
                this.usersChannels.splice(index, 1);
            },
            (error:any) => AppComponent.generalError( error.status )
            );
    }

    editChannel(channel: Channel){
        this.searchResults = [];
        this.editingChannel = true;
        this.editingChannelID = channel.id;
        this.createForm(channel.title, channel.description);
        this.resourceIds = channel.resourceids;
        this.getChannelAppResources(channel);
    }

    getChannelAppResources(channel: Channel){
        if(channel.resourceids.length > 0) {
            let filter = "";
            for(let i = 0; i < channel.resourceids.length; i++){
                filter += "(id eq '" + channel.resourceids[i] +"')";
                if (i != channel.resourceids.length - 1){
                    filter += " or ";
                }
            }

            this.appsService.getResourcesWithMedia( 99, 1, filter )
                .subscribe(
                    channelApps => {
                        this.channelApps = channelApps.data;
                    },
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }

    }

    onSubmitSearch(formValues: any) {
        this.searchTermChanged(this.searchterm.value, this.activeOnly);
    }

    searchTermChanged(searchTerm, activeOnly) {
        if(searchTerm && searchTerm.length>1) {
            this.appsService.getBySearch(searchTerm, "", activeOnly)
                .subscribe(
                    searchResults => {
                        if(this.searchingForResources) {
                            this.searchResults = searchResults.data;
                            this.searchingForResources = false;
                        }
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
        } else {
          this.searchResults = [];
        }
    }

    select(item){
        if (this.resourceIds.indexOf(item.id) === -1){
            this.resourceIds.push(item.id);

            this.appsService.getAppDetails( item.id )
              .subscribe(
                  app => {
                    this.channelApps.push(app);
                  },
                  (error:any) => AppComponent.generalError( error.status )
              );
        } else {
            let index = this.resourceIds.indexOf(item.id);
            this.resourceIds.splice(index, 1);

            let channelIndex = this.channelApps.indexOf(this.channelApps.find(x => x.id === item.id));
            this.channelApps.splice(channelIndex, 1);
        }
    }

    itemimage(item):string {
        if(!item.image) {
            var type = item.type_id;
            if(type==99){
                type = 'other';
            }
            return 'https://s3-eu-west-1.amazonaws.com/jisc-store-assets/icontype' + type + '.png';
        }
        return item.image;
    }

    itemTypeClass(item):string {
      var type = item.type_id;
      if(type==99){
          type = 'other';
      }
      return 'backgroundimage' + type;
    }

    shortTitle(appTitle: String) {
       return (appTitle.length>80) ? (appTitle.substr(0, 80)+'...') : appTitle;
    }

    shortDescription(appDescription: String) {
       return (appDescription.length>110) ? (appDescription.substr(0, 110)+'...') : appDescription;
    }

    resourceInChannel(resourceId: number){
        return this.resourceIds.indexOf(resourceId) !== -1;
    }

    resetForm(){
      this.searchResults = [];
      this.resourceIds = [];
      this.channelApps = [];
      this.createForm();
    }

}
