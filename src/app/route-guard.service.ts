import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router'
import { Cookie } from 'ng2-cookies/ng2-cookies' 

@Injectable({
  providedIn: 'root'
})

export class RouteGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // console.log("in route guard service")

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/'])

      return false

    } else {

      return true

    }

  }
}