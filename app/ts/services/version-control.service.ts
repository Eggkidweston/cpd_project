import { Injectable, bind } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { appSettings } from './services';
import { AuthenticationService } from './authentication.service';
import { SignedUrl } from '../models';

@Injectable()
export class VersionControlService
{
    constructor(protected http:Http, protected authenticationService:AuthenticationService) {
    }

}

export var versionControlServiceInjectables:Array<any> = [
    bind( VersionControlService ).toClass( VersionControlService )
];