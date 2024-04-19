// FileUtils.js
import { Platform } from 'react-native';

export const launchCreateDocumentIntent = () => {
  // Launch SAF intent to create a document
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      const Intent = require('react-native').Intent;
      const intent = new Intent('android.intent.action.CREATE_DOCUMENT');
      intent.addCategory('android.intent.category.OPENABLE');
      intent.setType('application/pdf');
      intent.putExtra('android.intent.extra.TITLE', 'my-test.pdf');
      resolve(intent);
    } else {
      reject(new Error('SAF is only available on Android'));
    }
  });
};
