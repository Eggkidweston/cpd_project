export class User
{
    id:number;
    name:string;
    username:string;
    email:string;
    password:string;
    updatedat:string;
    createdat:string;
    active:any;
    isadmin: boolean;
}

// TODO Refactor: this is synonymous with Resource
export class StoreApp
{
    id:string;
    author:string;
    attribution:string;
    type_id:number;
    createdby:number;
    createdDate:string;
    description:string;
    downloadCount:number;
    isfree:boolean;
    lastUpdatedDate:string;
    licensetype_id:number;
    licenceurl:string;
    likes:number;
    media:Array<Medium>;
    metrics:CollatedMetrics;
    myRating:number;
    name:string;
    numberOfRatings:number;
    overview:string;
    reviews:Array<Review>;
    updateHistory:Array<UpdateHistory>;
    widgetDescription:string;
    widgetImageSrc:string;
    average_rating:number;
    tags:Array<string>;
    trialurl:string;
    jorum_legacy_lastmodified:string;
    jorum_legacy_flag:boolean;
    jorum_legacy_metadata:Array<string>;
    image:string;
    active:boolean;
}

export class StoreAppMini {
    id: string;
    image:string;
    type_id:number;
    title:string;
    description:string;
    average_rating:number;
    jorum_legacy_flag:boolean;
}

export interface GetResourceResults {
    data: Array<StoreApp>;
    availableRows: number;
}

export class IdpMembers {
    entityID:string;
    name:string;
    createdAt:string;
    updatedAt:string;
    id:string
}

export interface IdpMemberResults {
    data: Array<IdpMembers>;
}

export interface GetSearchResults {
    data: Array<StoreAppMini>;
    availableRows: number;
}

export class CollatedMetrics
{
    downloads:DownloadMetrics;
}

export class DownloadMetrics
{
    today:number;
    yesterday:number;
    thisWeek:number;
    lastWeek:number;
    thisMonth:number;
    lastMonth:number;
    total:number;
}
export class TagCloud
{

    constructor( public Tags:Tag[] )
    {

    }
    public GetTag(id:number) :Tag{
        return this.Tags.filter(function(t){return t.id == id})[0];
    }
    public AddTag(tag: Tag){
        this.Tags.push(tag);
        //console.log('tagged');
    }
    public RemoveTag(id: number){
        this.Tags = this.Tags.filter(function(el) {
            return el.id !== id;
        });
    }
    public GetIds() :any[]{
           var ids = this.Tags.map(function(obj){
               var rObj = [];
               rObj.push(+obj.id);
               return rObj;
           });
        return ids ;
    }
    public GetFilterSyntax(){
        var filter = "";
        for (let tag of this.Tags) {
            filter += "(tag eq '"+tag.name+"')";
            if (tag != this.Tags[this.Tags.length -1]){
                filter += " and ";
            }
        }
        return filter;
    }
}

export class Tag
{

    public id:number;
    public name:string;
    public resource_count:string;
}


export class ShadowApp
{
    constructor( public _id:string,
                 public media:Array<ShadowMedium>,
                 public storeID:string,
                 public license:string,
                 public remixable:string,
                 public licenseLink:String,
                 public runURL:String )
    {
    }
}

export class ShadowMedium
{
    url:string;
    type_id:string;
    previewUrl:string;
}

export class Review
{
    constructor( public resource_id:number,
                 public title:string,
                 public description:string,
                 public rating:number )
    {
    };
}

export class Medium
{
    downloadUrl:string;
    previewUrl:string;
}

export class UpdateHistory
{
    comment:string;
    date:string;
}

export class Contributor
{
    id: number;
    imageUrl: string;
    name: string;
    username: string;
    email: string;
    active: boolean;
    reputation: any;
    createdat: string;
    updatedat: string;
    activities:Array<Activity>;
    resources:Array<StoreApp>;
}

export interface Activity
{
    type:string;
    comment:string;
    date:string;
}

export interface ResourceMetrics
{
    metrics:Array<ResourceMetric>;
}

export interface ResourceMetric
{
    day:number;
    total:number;
}

export interface SignedUrl
{
    signed_request:string;
    url:string;
}

// TODO Refactor: this is synonymous with StoreApp
export interface Resource
{
    file:any;
    type_id:number;
    licensetype_id:number;
    title:string;
    description:string;
    trialurl:string;
    url:string;
    youtubeurl: string;
    image:string;
    active:boolean;
    isfree:boolean;
    overview:string;
    recommended:boolean;
    relatedIds:Array<number>;
    tags:Array<string>;
    mediaUrls:Array<string>;
}

export interface DownloadInstructions
{
    local:string;
    notlocal:string;
}

export class Channel
{

   constructor( public title:string,
                public description:string,
                public resourceids:Array<number>,
                public id: number,
              )
   {
   };
}

export var ResourceTypes = ["APPLEAPP", "ANDROIDAPP", "IMAGE", "VIDEO", "AUDIO", "ARCHIVE_WEB", "ARCHIVE_OTHER", "WORD", "PDF", "POWERPOINT", "EXCEL", "WEB PAGE", "FLASH"];

export var ResourceInstructions = [
    "This is an iOS app, available on the app store and can be used on iOS capable devices only. Clicking continue will open the App Store in a new window.",
    "This is an android app, available on the android store and can be used on android capable devices only. Clicking continue will open the Android Store in a new window.",
    "This is an image file. It can be embedded in video or presentation, or used on a website or on it's own. If the resource opens in your browser, you can save it from there.",
    "This is a video file. You may be able to embed it in a presentation or use it on it's own if you have the appropriate video playback software. If the resource opens in your browser, you can save it from there.",
    "This is an audio file. You may be able to embed it in a presentation or use it own it's own if you have the appropriate audio playback software. If the resource opens in your browser, you can save it from there.",
    "This is an archive or zip and contains mulitple files that make up a standalone website. You may need to extract them to a folder to use them and open the html files in your internet browser.",
    "This is an archive or zip and contains mulitple files. You may need to extract them to a folder to use them.",
    "This is a Microsoft Word file. If the resource opens in your browser, you can save it from there.",
    "This is a PDF file. You may need to download a PDF reader to view. If the resource opens in your browser, you can save it from there.",
    "This is a Microsoft Powerpoint file. If the resource opens in your browser, you can save it from there.",
    "This is a Microsoft Excel file. If the resource opens in your browser, you can save it from there.",
    "This is a website. Clicking continue will open the website in a new window.",
    "This is a Flash movie. You will need to make sure you have the flash player installed to view it. If the resource opens in your browser, you can save it from there."
];


export var LicenseTypes = ["Apache License 2.0", "Apereo License", "BSD 3-Clause New or Revised license", "BSD 2-Clause Simplified or FreeBSD license", "CC0", "CC-BY", "CC-BY-SA", "CC-NC", "CC-BY-ND", "CC-BY-NC-SA 3.0", "CC-BY-NC-SA 4.0", "Common Development and Distribution License", "Eclipse Public License", "GNU General Public License (GPL)", "GNU Library or Lesser General Public License (LGPL)", "MIT License", "Mozilla Public License 2.0", "Proprietary"];
