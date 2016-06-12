import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Control, ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Tag, Resource } from '../../../models';
import { TagCloudComponent } from './tag-cloud.component/tag-cloud.component.ts';
import { FileUploader } from '../../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../../thirdparty/file-upload/file-select';
import { AppsService } from '../../../services/services';
import { AuthenticationService } from '../../../services/authentication.service';
import { ResourceTypes, LicenseTypes } from '../../../models';
import { RadioControlValueAccessor } from './radio-value-accessor';

let _ = require( 'underscore' );

let initialTags:Tag[] = [];

interface ITagsOperation extends Function
{
    ( tags:Tag[] ):Tag[];
}

@Component( {
    selector: 'submit-resource',
    template: require( './submit-resource.component.html' ),
    styles: [require( './submit-resource.scss' ).toString()],
    directives: [TagCloudComponent, FileDrop, FileSelect, RadioControlValueAccessor]
} )
export class SubmitResourceComponent
{
    @ViewChild( 'fileUploadButton' ) fileUploadButton;
    @ViewChild( 'iconUploadButton' ) iconUploadButton;
    @ViewChild( 'resourceUploadButton' ) resourceUploadButton;

    private newResourceTags:Subject<Tag> = new Subject<Tag>();
    private resourceTags:Observable<Tag[]>;
    private tagUpdates:Subject<any> = new Subject<any>();
    private create:Subject<Tag> = new Subject<Tag>();
    private remove:Subject<Tag> = new Subject<Tag>();

    private submitResourceForm:ControlGroup;
    private basicDetailsText:AbstractControl;
    private overviewText:AbstractControl;
    private descriptionText:AbstractControl;
    private resourceType:AbstractControl;
    private trialUrl:AbstractControl;
    private youTubeUrl:AbstractControl;
    private resourceUrl:AbstractControl;
    private licenseType:AbstractControl;

    public resourceNature:string = "file";

    protected uploader:FileUploader;
    protected iconUploader:FileUploader;
    protected resourceUploader:FileUploader;

    protected shaking:boolean = false;
    protected submitted:boolean = false;

    protected resourceTypes = ResourceTypes;
    protected licenseTypes = LicenseTypes;

    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;


    public fileOverBase( e:any ):void
    {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother( e:any ):void
    {
        this.hasAnotherDropZoneOver = e;
    }

    constructor( protected appsService:AppsService,
                 protected authenticationService:AuthenticationService,
                 protected router:Router,
                 fb:FormBuilder )
    {
        var that = this;

        this.uploader = new FileUploader( {} );
        this.iconUploader = new FileUploader( {
            onFileAdded: () =>
            {
                that.iconUploader.queue = [_.first( that.iconUploader.queue )];
            }
        } );
        this.resourceUploader = new FileUploader( {
            onFileAdded: () =>
            {
                that.resourceUploader.queue = [_.first( that.resourceUploader.queue )];
                that.resourceNature = "file";
            }
        } );

        this.resourceTags = this.tagUpdates
            .scan( ( tags:Tag[], operation:ITagsOperation ) => operation( tags ), initialTags )
            .publishReplay( 1 )
            .refCount();

        this.create
            .map( ( tag:Tag ):ITagsOperation => ( tags:Tag[] ) => _.uniq( tags.concat( tag ) ) )
            .subscribe( this.tagUpdates );

        this.remove
            .map( ( tag:Tag ):ITagsOperation => ( tags:Tag[] ) => _.without( tags, tag ) )
            .subscribe( this.tagUpdates );

        this.newResourceTags.subscribe( this.create );

        this.buildForm( fb );
    }


    protected buildForm( fb:FormBuilder )
    {
        let selectValidator = ( selectControl ) =>
        {
            if( selectControl.value != -1 ) return null;
            return { "invalidSelection": true };
        };

        this.submitResourceForm = fb.group( {
            "basicDetailsText": ["", Validators.required],
            "overviewText": ["", Validators.required],
            "descriptionText": ["", Validators.required],
            "trialUrl": ["", Validators.required],
            "youTubeUrl": ["", Validators.required],
            "resourceUrl": [""],
            "resourceType": ["", Validators.compose( [selectValidator] )],
            "licenseType": ["", Validators.compose( [selectValidator] )]
        } )

        this.basicDetailsText = this.submitResourceForm.controls['basicDetailsText'];
        this.overviewText = this.submitResourceForm.controls['overviewText'];
        this.descriptionText = this.submitResourceForm.controls['descriptionText'];
        this.trialUrl = this.submitResourceForm.controls['trialUrl'];
        this.youTubeUrl = this.submitResourceForm.controls['youTubeUrl'];
        this.resourceUrl = this.submitResourceForm.controls['resourceUrl'];
        this.resourceType = this.submitResourceForm.controls['resourceType'];
        this.licenseType = this.submitResourceForm.controls['licenseType'];

        (<Control>this.resourceType).updateValue( "-1" );
        (<Control>this.licenseType).updateValue( "-1" );
    }

    protected addTagToResource( tag:Tag ):void
    {
        this.create.next( tag );
    }

    protected removeTagFromResource( tag:Tag ):void
    {
        this.remove.next( tag );
    }

    protected uploadIconButtonClicked()
    {
        this.iconUploadButton.nativeElement.click();
    }

    protected uploadFileButtonClicked()
    {
        this.fileUploadButton.nativeElement.click();
    }

    protected uploadResourceButtonClicked()
    {
        this.resourceUploadButton.nativeElement.click();
    }

    protected get resourceFileValid():boolean
    {
        return !(this.resourceNature == 'file' && this.resourceUploader.queue.length != 1);
    }

    protected get resourceUrlValid():boolean
    {
        return !(this.resourceNature == 'url' && !this.resourceUrl.value);
    }

    protected onSubmit( formValues:any )
    {
        this.submitted = true;

        // this is baaaad...radio buttons not really supported in Angular 2 yet
        // big missing piece from RC 1!
        // rather than spend time writing a component that will do this,
        // let's just fudge it for the moment
        if( this.submitResourceForm.valid && this.resourceFileValid && this.resourceUrlValid ) {
            this.submitResource( formValues );
        } else {
            this.shakeForm();
        }
    }

    protected submitResource( formValues:any )
    {
        // TODO Refactor to get out of callback hell
        this.getS3MediaUrls( mediaUrls => this.getS3IconUrl( iconUrl => this.resourceTags.subscribe( tags =>
            {
                let createdResource = {
                    type_id: formValues.resourceType,
                    licensetype_id: formValues.licenseType,
                    title: formValues.basicDetailsText,
                    description: formValues.descriptionText,
                    trialurl: formValues.trialUrl,
                    youtubeurl: formValues.youTubeUrl,
                    image: iconUrl,
                    active: true,
                    isfree: true,
                    overview: formValues.overview,
                    recommended: false,
                    relatedIds: new Array<number>(),
                    tags: _.map( tags, ( tag ) => tag.name ),
                    mediaUrls: mediaUrls
                } as Resource;

                if( this.resourceNature == 'file' ) {
                    createdResource.file = this.resourceUploader.queue[0];
                } else {
                    createdResource.url = this.resourceUrl.value;
                }

                this.appsService.submitResource( createdResource ).subscribe(
                    newResource => this.router.navigate( ['AppDetails', { id: newResource.id }] ),
                    err => console.log( `Error submitting resource: ${err}` )
                )
            }
        ) ) );
    }

    // TODO Refactor these two methods into one
    protected getS3MediaUrls( next:( urls:Array<string> ) => void )
    {
        let urls = new Array<string>();

        if( this.uploader.queue.length === 0 ) next( urls );
        else {
            //noinspection TypeScriptUnresolvedFunction
            let uploadFile = Observable.bindNodeCallback( this.appsService.uploadFileToS3 );

            //noinspection TypeScriptUnresolvedFunction
            Observable.from( this.uploader.queue )
                .flatMap( e => uploadFile( e, this.authenticationService.apiKey ) )
                .subscribe(
                    url => urls.push( url ),
                    e => console.log( `Could not upload file: ${e}` ),
                    () => next( urls )
                );
        }
    }

    protected getS3IconUrl( next:( url:string ) => void )
    {
        let url:string;

        if( this.iconUploader.queue.length === 0 ) next( url );
        else {
            //noinspection TypeScriptUnresolvedFunction
            let uploadFile = Observable.bindNodeCallback( this.appsService.uploadFileToS3 );

            //noinspection TypeScriptUnresolvedFunction
            Observable.from( this.iconUploader.queue )
                .flatMap( e => uploadFile( e, this.authenticationService.apiKey ) )
                .subscribe(
                    u => url = u,
                    e => console.log( `Could not upload file: ${e}` ),
                    () => next( url )
                );
        }
    }

    protected shakeForm()
    {
        this.shaking = true;
        setTimeout( () =>
        {
            this.shaking = false;
        }, 500 );
    }
}
