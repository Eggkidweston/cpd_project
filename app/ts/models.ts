export class User {
    emailAddress: string;
    name: string;
}

export class StoreApp {
    id: string;
    
    averageRating: number;
    createdBy: User;
    createdDate: string;
    description: string;
    downloadCount: number;
    isFree: boolean;
    lastUpdatedDate: string;
    licenseType: LicenseType;
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
}

enum LicenseType {
}

export class Review {
    body: string;
}

export class Medium {
    downloadUrl: string;
    previewUrl: string;
}

export class UpdateHistory {
    comment: string;
    date: string;
}