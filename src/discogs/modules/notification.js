// Notifications

import { isFunction } from "../../utils/utils";

export const showNotificationDebug = (message, onShow) => { showNotification('debug', message, onShow); }
export const showNotificationInfo = (message, onShow) => { showNotification('info', message, onShow); }
export const showNotificationWarning = (message, onShow) => { showNotification('warning', message, onShow); }
export const showNotificationError = (message, onShow) => { showNotification('error', message, onShow); }

const notificationStack = createNotificationStack();

function createNotificationStack() {
  const stack = document.createElement('div');
  stack.className = 'notification-stack';
  document.body.appendChild(stack);
  return stack;
}

export const showNotification = (type, message, onShow) => {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<div class="header">Bandcamp to Discogs</div>${message}<span class="notification-close">×</span>`;

  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', function () {
    closeNotification(notification);
  });

  notificationStack.appendChild(notification);

  if (isFunction(onShow)) {
    onShow(notification);
  }

  setTimeout(function () {
    closeNotification(notification);
  }, 20000); // Remove notification after 20 seconds
}

export const closeNotification = (notification) => {
  notificationStack.removeChild(notification);
}
