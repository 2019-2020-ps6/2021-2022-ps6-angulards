import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';

import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  public userForm: FormGroup;
  private adminCode = 'admin123';

  constructor(public formBuilder: FormBuilder, public userService: UserService, private router: Router) {
    this.userForm = this.formBuilder.group({
      email: [''],
      firstName: [''],
      lastName: [''],
      statcode: [''],
      password: [''],
      admin: false
    });
  }

  ngOnInit(): void {
  }

  addUser(): void {
    // We retrieve here the user object from the userForm, and we cast the type "as User".
    const userToCreate: User = this.userForm.getRawValue() as User;
    if (userToCreate.admin && !this.adminCodeCorrect()) {
      alert('Mauvais code Administrateur');
    }
    else {
      this.userService.addUser(userToCreate);
      this.router.navigate(['/welcomepage']).then();
    }
  }

  // For debugging purposes
  showUser(): void {
    const userToCreate: User = this.userForm.getRawValue() as User;
    console.log(userToCreate);
    // this.checkAdminCode();
  }

  isAdminSignup(): boolean {
    const box = document.getElementById('admin') as HTMLInputElement;
    return box.checked;
  }

  adminCodeCorrect(): boolean {
    const adminField = document.getElementById('admincode') as HTMLInputElement;
    // console.log(adminField.value);
    // console.log(adminField.value === this.adminCode);
    return adminField.value === this.adminCode;
  }
}
