import { Notify } from 'quasar';

export function showErrorNotification(status, message) {
  if (status === 200 || status === 201) {
    Notify.create({
      type: "positive",
      message: message,
      timeout: 2000
    })
  } else if (status === 409) {
    Notify.create({
      type: "negative",
      message: message,
      timeout: 5000,
      actions: [
        { label: 'OK', color: 'yellow' }
      ]
    })
  } else {
    Notify.create({
      type: "negative",
      message: message,
      timeout: 2000
    });
  }
}

