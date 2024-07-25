// Notifications

export const showNotificationDebug = (message) => { showNotification(message, 'debug'); }
export const showNotificationInfo = (message) => { showNotification(message, 'info'); }
export const showNotificationWarning = (message) => { showNotification(message, 'warning'); }
export const showNotificationError = (message) => { showNotification(message, 'error'); }

const notificationStack = createNotificationStack();

function createNotificationStack() {
  const stack = document.createElement('div');
  stack.className = 'notification-stack';
  document.body.appendChild(stack);
  return stack;
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<div class="header">Bandcamp to Discogs</div>${message}<span class="notification-close">×</span>`;

  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', function () {
    notificationStack.removeChild(notification);
  });

  notificationStack.appendChild(notification);

  setTimeout(function () {
    notificationStack.removeChild(notification);
  }, 20000); // Remove notification after 20 seconds
}
