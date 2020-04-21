import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UoaErrorsConfig {
  public clientErrorCodes = [400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 418, 429, 431];
  public serverErrorCodes = [500, 501, 502, 503, 504, 505, 506];
  public ErrorPageContent = {
    ErrorCode400: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`,
    },
    ErrorCode401: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`,
    },
    ErrorCode403: {
      title: `Access Restricted`,
      content: `You do not have permission to view this page. Please ensure that you are logged in and try again.
      <p>
        If you still don't have access and believe you are seeing this page in error, contact us on
        <a href="tel:0800 61 62 63" target="_blank">0800 61 62 63 (within New Zealand)</a> or
        <a href="tel:+64 9 373 7513" target="_blank">+64 9 373 7513 (outside New Zealand)</a> or at
        <a href="mailto:studentinfo@auckland.ac.nz" target="_blank">studentinfo@auckland.ac.nz</a>.
      </p>`,
    },
    ErrorCode404: {
      title: `Page Not Found`,
      content: `Sorry, you've encountered an error, please try going back in your browser or visit
      <a class="uoa-link" href="https://www.auckland.ac.nz/">auckland.ac.nz</a>.`,
    },
    ErrorCode405: {
      title: `Method not allowed!`,
      content: `The requested method is not allowed for the requested URL.
      <p>Sorry, something has gone wrong and we can’t connect you to the system. You may need to login again,
      or try going back in your browser and following the link again.</p>
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a>
      </p>`,
    },
    ErrorCode406: {
      title: `Content Unable to be Displayed`,
      content: `Sorry, something has gone wrong and we can’t connect you to the page you’re trying to reach.
      You may need to login again, or try going back in your browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode407: {
      title: `Authentication Required`,
      content: `Sorry, something has gone wrong and we can’t connect you to the page you’re trying to reach as you’re not correctly logged in.
      You may need to refresh the page to login, or try going back in your browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode408: {
      title: `Request Timeout`,
      content: `The request took a little longer than expected to respond.
      <p>Please refresh the page or try again a little later.</p>`,
    },
    ErrorCode409: {
      title: `Bad Request`,
      content: `The system is currently unavailable, we apologise for any inconvenience.
      <p>Please try again later.</p>`,
    },
    ErrorCode410: {
      title: `Resource is no longer available!`,
      content: `The requested URL is no longer available and we can’t work out where you’re trying to reach, sorry!
      <a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a>.`,
    },
    ErrorCode411: {
      title: `Bad Content-Length!`,
      content: `Sorry, something has gone wrong and we can’t connect you to the system. You could try going back in the browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a>.</p>`,
    },
    ErrorCode412: {
      title: `Precondition Failed!`,
      content: `Sorry, something has gone wrong and we can’t connect you to the system. You could try going back in the browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode413: {
      title: `File upload too large!`,
      content: `The size of the file that was being uploaded is too large. Please reduce the file size and try again.`,
    },
    ErrorCode414: {
      title: `Submitted URI too large!`,
      content: `Sorry, something has gone wrong with the URL you’re trying to access and we can’t connect you.
      Please check the URL is correct, or you could try going back in the browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode415: {
      title: `Unsupported media type!`,
      content: `Sorry, something has gone wrong and we can’t connect you to the system.
       It looks like you’re trying to access a file type that isn’t supported.
       <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
       Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode418: {
      title: `I’m a Teapot`,
      content: `Sorry, it looks like you’re using the wrong device. This isn’t for coffee, it’s clearly a teapot.
       <p>If you believe you’re seeing this error incorrectly, you are.</p>`,
    },
    ErrorCode429: {
      title: `Too Many Requests`,
      content: `ou're seeing this because you've made a large number of requests to our system within a short period of time.
      Please wait a minute or two and then try refreshing the page.`,
    },
    ErrorCode431: {
      title: `Request Header Fields Too Long`,
      content: `You may be seeing this error due to cookie settings or the URL is too long. Try clearing your cookies
       and refreshing the page; or if you've altered the URL try removing this and navigating again.`,
    },

    ErrorCode500: {
      title: `Service Unavailable`,
      content: `The system is currently unavailable and we apologise for any inconvenience.
      <p>Please try again later.</p>`,
    },
    ErrorCode501: {
      title: `Cannot process request!`,
      content: `Sorry, we can’t connect you to the system properly,
      you could reload the page or try going back in the browser and following the link again.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue</a>.</p>`,
    },
    ErrorCode502: {
      title: `Connection Error`,
      content: `We can’t connect you to our systems at the moment.
      <p>Please check your internet connection or try again later.</p>`,
    },
    ErrorCode503: {
      title: `Service Unavailable`,
      content: `The system is currently unavailable and we apologise for any inconvenience.
      <p>Please try again later.</p>`,
    },
    ErrorCode504: {
      title: `Request Timeout`,
      content: `The request took a little longer than expected to respond.
      <p>Please refresh the page or try again a little later.</p>`,
    },
    ErrorCode505: {
      title: `Version Not Supported`,
      content: `Sorry, something has gone wrong and we can’t connect you to the system.
      It looks like you’re trying to access using a browser or connection that isn’t supported.
      Check your connection settings or use an alternative browser such as Google Chrome, Firefox or Edge.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },
    ErrorCode506: {
      title: `Variant also varies!`,
      content: `Sorry, something has gone wrong and we can’t connect you to the system.
      It looks like you’re trying to access something that you don’t have permission to access.
      <p><a class="uoa-link" href=https://www.auckland.ac.nz/en/about-us/connect-with-us/contact-us.html>
      Please contact us if you need help or would like to report this issue.</a></p>`,
    },

    ErrorCodeDefault: {
      title: `Unexpected Error`,
      content: `We’re sorry that you encountered an error with our site. If you require help, please call
      <a href="tel:0800 61 62 63" target="_blank">0800 61 62 63 (within New Zealand)</a> or
      <a href="tel:+64 9 373 7513" target="_blank">+64 9 373 7513 (outside New Zealand)</a> or at
      <a href="mailto:studentinfo@auckland.ac.nz" target="_blank">studentinfo@auckland.ac.nz</a>`,
    },
  };
}
