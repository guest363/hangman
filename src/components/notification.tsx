import styles from "./notification.module.css";

export const Notification = ({ message, type }) => {
  let notificationStyle = styles.notification;

  switch (type) {
    case "success":
      notificationStyle = `${styles.notification} ${styles.success}`;
      break;
    case "error":
      notificationStyle = `${styles.notification} ${styles.error}`;
      break;
    case "warning":
      notificationStyle = `${styles.notification} ${styles.warning}`;
      break;
    default:
      notificationStyle = styles.notification;
      break;
  }

  return <div className={notificationStyle}>{message}</div>;
};
