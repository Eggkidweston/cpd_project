import { Component, ViewChild, Input, Output, EventEmitter } from 'angular2/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from 'angular2/common';
import { AppsService } from '../../services/services';
import { Review } from '../../models'
;
@Component({
    selector: 'submit-review',
    template: require('./submitreview.component.html')
})
export class SubmitReviewComponent {
    @Input() resourceId: number;
//    @Output() reviewAdded: EventEmitter<Review> = new EventEmitter();
    
    reviewForm: ControlGroup;
    reviewTitle: AbstractControl;
    reviewDescription: AbstractControl;
    
    // replace this with reference to rating component
    reviewRating: number;
    
    busy: boolean = false;
    reviewing: boolean = false;
    
    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.reviewForm = fb.group({
            "reviewTitle": ["", Validators.required],
            "reviewDescription": ["", Validators.required]
        });
        
        this.reviewTitle = this.reviewForm.controls['reviewTitle'];
        this.reviewDescription = this.reviewForm.controls['reviewDescription'];
    }
     
    submitReview() {
        this.reviewing = true;
    }
    
    onSubmit(formVaules: any) {
        if( this.reviewForm.valid ) {
            this.busy = true;
            
            let review = new Review(this.resourceId, this.reviewTitle.value, this.reviewDescription.value, this.reviewRating);
                
            this.appsService.submitReview(review,
                (review) => {
                    this.busy = false;
                    this.reviewing = false;
                    //this.reviewAdded.emit(review);
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