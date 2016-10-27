import { Injectable, bind } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { appSettings } from '../../../settings';
import { IdpMemberResults } from '../models';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';


// RxJS might be overkill for this...
@Injectable()
export class IDPRegisterService {

    constructor(private http:Http, 
                public router: Router) {
    };
    
    public getIdpMembers()
    {
        let memberURL = `${appSettings.idpMembers}`;
        return this.http.get(memberURL)
            .map( res => <IdpMemberResults>res.json() )
            .catch( this.handleError );
    }

    private handleError( error:Response )
    {
        return Observable.throw( error );
    }
}

export var idpRegisterServiceInjectables: Array<any> = [
    bind(IDPRegisterService).toClass(IDPRegisterService)
];