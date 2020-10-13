import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export class AppCustomDirective extends Validators {

  static AdultsValidator(adultsValue: FormControl) {
    const adults = adultsValue.value;
    if (adults == 0)
      return { requiredAdults: true };
  }

  static ChildrenValidator(childrenValue: FormControl) {
    const children = childrenValue.value;
    if (children == 0)
      return { requiredChildren: true };
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm : FormGroup;
  minFromDate = new Date();
  maxToDate   = new Date(this.minFromDate.getFullYear(), this.minFromDate.getMonth()+1);
  adults      = 0;
  children    = 0;

  constructor(
    private formBuilder: FormBuilder,
  )
  {
    // this.maxToDate.setDate(this.maxToDate.getDate() + 1);
    this.searchForm = this.formBuilder.group(
      {
        Location: new FormControl('', [Validators.required, Validators.minLength(2)]),
        FromDate: new FormControl(this.minFromDate, [Validators.required]),
        ToDate: new FormControl(this.maxToDate, [Validators.required]),
        Adults: new FormControl(this.adults, [AppCustomDirective.AdultsValidator]),
        Children: new FormControl(this.children, [AppCustomDirective.ChildrenValidator]),
      });
  }

  ngOnInit(): void {
  }

  dateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    return date > this.searchForm.get('FromDate').value;
  }

  print_guests(): string {
    let total = this.adults + this.children;
    if (total == 0) {
      return '';
    }
    else if (total == 1) {
      return '1 Guest';
    }
    else {
      return total+' Guests';
    }
  }

  print_adults(): string {
    if (this.adults == 1) {
      return '1 adult';
    }
    else {
      return this.adults +' adults';
    }
  }

  print_children(): string {
    if (this.children == 1) {
      return '1 child';
    }
    else {
      return this.children +' children';
    }
  }

  add_adults(): void {
    if (this.adults == 25)
      return;
    this.adults += 1;
    this.searchForm.controls.Adults.setValue(this.adults);
  }

  add_children(): void {
    if (this.children == 15)
      return;
    this.children += 1;
    this.searchForm.controls.Children.setValue(this.children);
  }

  remove_adults(): void {
    if (this.adults == 0)
      return;
    this.adults -= 1;
    this.searchForm.controls.Adults.setValue(this.adults);
  }

  remove_children(): void {
    if (this.children == 0)
      return;
    this.children -= 1;
    this.searchForm.controls.Children.setValue(this.children);
  }

  allValid(): boolean {
    let valid_location  = this.searchForm.get('Location').valid;
    let valid_FromDate  = this.searchForm.get('FromDate').valid;
    let valid_ToDate    = this.searchForm.get('ToDate').valid;
    let valid_adults    = this.searchForm.get('Adults').valid;
    let valid_children  = this.searchForm.get('Children').valid;
    return valid_location && valid_FromDate && valid_ToDate && (valid_adults || (valid_adults && valid_children));
  }

  onSubmit(searchData): void {
    /* TODO: Send these data to search-service in order to do the process is needed */
    console.log(searchData);
    this.adults = 0;
    this.children = 0;
    // TODO: What to do with fields after submit search...
    // this.searchForm.patchValue({
    //   Location: '',
    //   FromDate: this.minFromDate,
    //   ToDate: this.maxToDate
    // })
    this.searchForm.reset();
  }

  changeFormatDate(date: string): string {
    let re = /\//gi;
    return date.replace(re,'-');
  }

  getErrorMessageFromDate(): string {
    if (this.searchForm.get('FromDate').hasError('required'))
      return 'This field is required';
    return '';
  }

  getErrorMessageToDate(day: Date): string {
    if (this.searchForm.get('ToDate').hasError('required'))
      return 'This field is required';
    else if (!this.dateFilter(day))
      return 'Not a valid date';
    return '';
  }

}
