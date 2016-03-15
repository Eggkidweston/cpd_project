export class User {
    id: number;
	name: string;
    username: string;
	email: string;
	password: string;
    updatedat: string;
    createdat: string;
	active: any;
}

export class StoreApp {
    id: string;
    
    createdBy: User;
    createdDate: string;
    description: string;
    downloadCount: number;
    isFree: boolean;
    lastUpdatedDate: string;
    licensetype_id: LicenseType;
    likes: number;
    media: Array<Medium>;
    myRating: number;
    name: string;
    numberOfRatings: number;
    overview: string;
    reviews: Array<Review>;
    updateHistory: Array<UpdateHistory>;
    widgetDescription: string;
    widgetImageSrc: string;
    average_rating: number;
}

export enum LicenseType {
    Free, Paid
}

export class Review {
    constructor( 
        public resource_id: number, 
        public title: string, 
        public description: string, 
        public rating: number ) {};
}

export class Medium {
    downloadUrl: string;
    previewUrl: string;
}

export class UpdateHistory {
    comment: string;
    date: string;
}