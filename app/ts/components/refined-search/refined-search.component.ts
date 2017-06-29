import { Component, Output, EventEmitter } from '@angular/core';
import { AppsService } from '../../services/apps.service';
import { AppComponent } from '../../app.component';
import { ResourceProperty } from '../../models';

@Component({
    selector: 'refined-search',
    styles: [require('./refined-search.scss').toString()],
    template: require('./refined-search.component.html')
})
export class RefinedSearchComponent {
    @Output() refinedSearchUpdated: EventEmitter<any> = new EventEmitter();
    private resourceUseType: string;
    private resourceSubject: string;
    private resourceLevel: string;
    private subjectFilter: string;

    private resourceUseTypes:Array<ResourceProperty>;
    private resourceLevels:Array<ResourceProperty>;
    private resourceSubjects:Array<ResourceProperty>;

    constructor(protected appsService:AppsService) {
        this.loadResourceUseTypes();
        this.loadResourceLevels();
        this.loadResourceSubjects();

        this.resourceUseType = this.getStoredValue('resource-usetype');
        this.resourceSubject = this.getStoredValue('resource-subject');
        this.resourceLevel = this.getStoredValue('resource-level');
    }

    getStoredValue(category){
        if (typeof(Storage) !== "undefined" && localStorage.getItem(category) !== null) {
            return localStorage.getItem(category);
        }
        return "all";
    }

    update(category, value, filter?){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(category, value);
        }

        if (category == "resource-subject"){
            this.resourceSubject = value;
        }

        if (category == "resource-level"){
            this.setSubjectFilter(value);
            if (value !== "all") {
                this.resourceSubject = "all";
                localStorage.setItem("resource-subject", "all");
            }
        }

        this.refinedSearchUpdated.emit(null);
    }

    setSubjectFilter(value){
        if(this.resourceLevel !== "all"){
            let index = this.resourceLevels.map((o) => o.id).indexOf(parseInt(value));
            if (index == -1) {
                this.subjectFilter = null;
                return;
            }
            this.subjectFilter = this.resourceLevels[index].filter;
        }
    }

    loadResourceUseTypes() {
        this.appsService.getResourceUseTypes()
            .subscribe(
                resourceUseTypes =>
                {
                    this.resourceUseTypes = resourceUseTypes;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadResourceLevels() {
        this.appsService.getResourceLevels()
            .subscribe(
                resourceLevels =>
                {
                    this.resourceLevels = resourceLevels;
                    this.setSubjectFilter(this.resourceLevel);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadResourceSubjects() {
        this.appsService.getResourceSubjects()
            .subscribe(
                resourceSubjects =>
                {
                    this.resourceSubjects = resourceSubjects;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }
}
