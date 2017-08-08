import { Component, Output, EventEmitter } from '@angular/core';
import { AppsService } from '../../../../services/apps.service';
import { AppComponent } from '../../../../app.component';
import { ResourceProperty } from '../../../../models';
import { ControlGroup, FormBuilder, AbstractControl } from '@angular/common';
import { RouteParams } from '@angular/router-deprecated';


@Component({
    selector: 'category-select',
    styles: [require('./category-select.scss').toString()],
    template: require('./category-select.component.html')
})
export class CategorySelectComponent {
    @Output() categoriesUpdated: EventEmitter<any> = new EventEmitter();

    public resourceId: number;

    searchForm: ControlGroup;
    formUseType: AbstractControl;
    formLevel: AbstractControl;
    formSubject: AbstractControl;

    private resourceUseType: number;
    private resourceSubject: number;
    private resourceLevel: number;
    private subjectFilter: string;

    private resourceUseTypes: Array<ResourceProperty>;
    private resourceLevels: Array<ResourceProperty>;
    private resourceSubjects: Array<ResourceProperty>;

    private selectedUseType: ResourceProperty;
    private selectedLevel: ResourceProperty;
    private selectedSubject: ResourceProperty;

    private displayCategoryForm = true;

    constructor(protected appsService: AppsService, fb: FormBuilder, params: RouteParams) {
        this.loadResourceUseTypes();
        this.loadResourceLevels();
        this.loadResourceSubjects();

        this.searchForm = fb.group({
            'formUseType' : [''],
            'formLevel' : [''],
            'formSubject' : ['']
        });

        this.resourceId = +params.get( 'id' );

        this.formUseType = this.searchForm.controls['formUseType'];
        this.formLevel = this.searchForm.controls['formLevel'];
        this.formSubject = this.searchForm.controls['formSubject'];
    }

    setSubjectFilter(value){
        let index = this.resourceLevels.map((o) => o.id).indexOf(parseInt(value));
        if (index == -1) {
            this.subjectFilter = null;
            return;
        }
        this.subjectFilter = this.resourceLevels[index].filter;
    }

    getCategoryItem(value, categoryArray){
        let index = categoryArray.map((o) => o.id).indexOf(parseInt(value));
        return categoryArray[index];
    }

    loadResourceUseTypes() {
        this.appsService.getResourceUseTypes()
            .subscribe(
                resourceUseTypes =>
                {
                    this.resourceUseTypes = resourceUseTypes;
                    this.resourceUseType = this.resourceUseTypes[0].id;
                    this.selectedUseType = this.getCategoryItem(this.resourceUseTypes[0].id, this.resourceUseTypes);
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
                    this.resourceLevel = this.resourceLevels[0].id;
                    this.setSubjectFilter(this.resourceLevel);
                    this.selectedLevel = this.getCategoryItem(this.resourceLevels[0].id, this.resourceLevels);
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
                    this.resourceSubject = this.resourceSubjects[0].id;
                    this.selectedSubject = this.getCategoryItem(this.resourceSubjects[0].id, this.resourceSubjects);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    onSubmitAssignCategories() {
        let resourceAttributes = {
            'subjects': [],
            'levels': [],
            'usetypes': []
        };

        resourceAttributes.subjects.push(this.formSubject.value);
        resourceAttributes.levels.push(this.formLevel.value);
        resourceAttributes.usetypes.push(this.formUseType.value);

        let resourceCategories = {
            'subjects': [this.selectedSubject],
            'levels': [this.selectedLevel],
            'usetypes': [this.selectedUseType]
        };

        this.appsService.editResourceAttributes(this.resourceId, JSON.stringify(resourceAttributes),
            (done: any) => {
                this.displayCategoryForm = false;
                this.categoriesUpdated.emit({ event:event, resourceCategories: resourceCategories });
            },
            (error: any) => AppComponent.generalError( error.status )
        );
    }


}
