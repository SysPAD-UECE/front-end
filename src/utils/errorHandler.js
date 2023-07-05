import { Notify } from 'quasar';

export function showErrorNotification(status) {
  if (status === 401) {
    Notify.create({
      type: "negative",
      message: "Unauthorized Access: You are not authorized to perform this action.",
      timeout: 5000,
      actions: [
      { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
    ]
    });
  } else if (status === 409) {
    Notify.create({
      type: "negative",
      message: "Your activation token is invalid! We have sent a new activation email to you. Please check your inbox.",
      timeout: 5000,
      actions: [
      { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
    ]
    });
    
  } else {
    Notify.create({
      type: "negative",
      message: "Oops! Something went wrong. Please try again later.",
      timeout: 2000,
    });
  }
}