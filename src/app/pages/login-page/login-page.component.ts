import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AuthResponse } from '../../types/authResponse.type';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get identifierErrors() {
    return this.loginForm.controls.identifier.errors
  }

  get passwordErrors() {
    return this.loginForm.controls.password.errors
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    this.isLoading = true;
    console.log(this.loginForm);

    if (!this.loginForm.valid) return;

    this.authService
      .login(this.loginForm.value)
      .subscribe((response: AuthResponse) => {
        this.authService.setToken(response.jwt);
        this.userService.setUser(response.user);

        this.isLoading = false;

        this.loginForm.reset();

        this.router.navigateByUrl('/');
      });
  }
}
