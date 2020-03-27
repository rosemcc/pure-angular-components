import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UoaErrorsConfig {
  public clientErrorCodes = [400, 401, 403, 404, 408, 409];
  public serverErrorCodes = [500, 502, 503, 504];
  public ErrorPageContent = {
    ErrorCode400: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`
    },
    ErrorCode401: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`
    },
    ErrorCode403: {
      title: `Access Restricted`,
      content: `You do not have permission to view this page. Please ensure that you are logged in and try again.
      <p>
        If you still don't have access and believe you are seeing this page in error, contact us on
        <a href="tel:0800 61 62 63" target="_blank">0800 61 62 63 (within New Zealand)</a> or
        <a href="tel:+64 9 373 7513" target="_blank">+64 9 373 7513 (outside New Zealand)</a> or at
        <a href="mailto:studentinfo@auckland.ac.nz" target="_blank">studentinfo@auckland.ac.nz</a>.
      </p>`
    },
    ErrorCode404: {
      title: `Page Not Found`,
      content: `We're sorry that you've encountered an error, please try going back in you browser or visit
      <a class="uoa-link" href="https://www.auckland.ac.nz/">auckland.ac.nz</a>.`
    },
    ErrorCode408: {
      title: `Request Timeout`,
      content: `The request took a little longer than expected to respond.
      <p>Please refresh the page or try again a little later.</p>`
    },
    ErrorCode409: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`
    },

    ErrorCode500: {
      title: `Service Unavailable`,
      content: `The system is currently unavailable and we apologise for any inconvenience.
      <p>Please try again later.</p>`
    },
    ErrorCode502: {
      title: `Connection Error`,
      content: `The server is unable to respond to the request.
      <p>Please check your internet connection or try again later.</p>`
    },
    ErrorCode503: {
      title: `Service Unavailable`,
      content: `The system is currently unavailable and we apologise for any inconvenience.
      <p>Please try again later.</p>`
    },
    ErrorCode504: {
      title: `Request Timeout`,
      content: `The request took a little longer than expected to respond.
      <p>Please refresh the page or try again a little later.</p>`
    },
    ErrorCodeDefault: {
      title: `Unexpected Error`,
      content: `We’re sorry that you encountered an error with our site. If you require help, please call 0800 61 62 63 or email studentinfo@auckland.ac.nz.`
    }
  };
}
