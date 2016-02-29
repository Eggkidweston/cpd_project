import { Component, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from 'angular2/common';
import { AppsService } from '../../services/services';

@Component({
    selector: 'submit-review',
    template: require('./submitreview.component.html')
})
export class SubmitReviewComponent {
    reviewForm: ControlGroup;
    reviewText: AbstractControl;
    reviewTitle: AbstractControl;
    
    busy: boolean = false;
    reviewing: boolean = false;
    
    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.reviewForm = fb.group({
            "reviewText": ["", Validators.required],
            "reviewTitle": ["", Validators.required]
        });
        
        this.reviewTitle = this.reviewForm.controls['reviewTitle'];
        this.reviewText = this.reviewForm.controls['reviewText'];
    }
     
    submitReview() {
        this.reviewing = true;
    }
    
    onSubmit(formVaules: any) {
        if( this.reviewForm.valid ) {
            this.busy = true;
            
            this.appsService.submitReview(this.reviewTitle.value, 
                this.reviewText.value,
                (review) => {
                    this.busy = false;
                    this.reviewing = false;
                },
                (err) => {
                    console.log(err);
                    this.busy = false;
                    this.reviewing = false;
                }
            );
        }
    }
    
    cancelClicked() {
        this.reviewing = false;
    }
}