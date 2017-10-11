declare var process: any;

export var appSettings = {
    apiRoot: process.env.API_ROOT,
    curationRoot: process.env.CURATION_ROOT,
    s3Root: process.env.S3_ROOT,
    idpMembers: process.env.IDP_MEMBERS
};