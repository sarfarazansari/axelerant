import { Injectable } from '@angular/core';

// return the global native browser window object
function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowRefService {
  get nativeWindow(): any {
    return _window();
  }
}
