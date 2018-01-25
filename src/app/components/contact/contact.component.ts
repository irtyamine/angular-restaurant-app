import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Feedback, ContactType } from '../../shared/feedback';
import { FeedbackService } from '../../services/feedback.service';
import { flyInOut, expandVis } from '../../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expandVis()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  @ViewChild(FormGroupDirective) feedbackFormDirective;
  feedback: Feedback;
  errMsg: string;
  contactType = ContactType;
  formErrors = {
    firstname: '',
    lastname: '',
    tel: '',
    email: '',
    message: ''
  };
  submitted = false;
  submitting = false;

  validationMessages = {
    'firstname': {
      'required': 'first name is required',
      'minlength': 'first name must be at least 2 characters',
      'maxlength': 'first name must be less than 25 characters'
    },
    'lastname': {
      'required': 'last name is required',
      'minlength': 'last name must be at least 2 characters',
      'maxlength': 'last name must be less than 25 characters'
    },
    'tel': {
      'pattern': 'must be telephone number'
    },
    'email': {
      'email': 'Should be valid email'
    },
    'message': {
      'required': 'Message is required'
    }
  };

  constructor( private fb: FormBuilder, private feedbackService: FeedbackService ) {
    this.createForm();
   }

  ngOnInit() {
  }

  onValueChange(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      tel: ['', Validators.pattern],
      email: ['', Validators.email],
      agree: false,
      contactType: 'None',
      message: ['', Validators.required ]
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange(); // reset form validation messages
  }

  onSubmit() {
    this.submitting = true;
    this.feedbackService.getFeedback().post(this.feedbackForm.value)
      .subscribe((feed) => {
                             this.submitted = true;
                             setTimeout(() => { this.submitted = false; }, 5000);
                             this.submitting = false;
                             this.feedback = feed;
                            });
    this.feedbackFormDirective.resetForm();
  }

}
