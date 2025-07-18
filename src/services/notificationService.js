

export const notificationService = {
  sendNotification: (message, type = "info") => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
};
