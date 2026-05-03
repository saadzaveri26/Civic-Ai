import { Logging } from '@google-cloud/logging';

const isProduction = process.env.NODE_ENV === 'production';
let logging: Logging | null = null;
let logInstance: any = null;

if (isProduction) {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
    logging = new Logging(projectId ? { projectId } : undefined);
    logInstance = logging.log('civicai-api-logs');
  } catch (error) {
    console.error('Failed to initialize Google Cloud Logging', error);
  }
}

type LogSeverity = 'DEFAULT' | 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';

export async function logEvent(severity: LogSeverity, message: string, metadata: Record<string, any> = {}) {
  if (isProduction && logInstance) {
    try {
      const entry = logInstance.entry(
        { resource: { type: 'global' }, severity },
        { message, ...metadata }
      );
      // Fire and forget so we don't block requests
      logInstance.write(entry).catch((err: any) => console.error('Error writing log', err));
    } catch (error) {
      console.error('Failed to write to Cloud Logging', error);
    }
  } else {
    // Fall back to console.log in non-production environments
    const payload = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    
    switch(severity) {
      case 'ERROR':
      case 'CRITICAL':
      case 'ALERT':
      case 'EMERGENCY':
        console.error(`[${severity}] ${message} ${payload}`);
        break;
      case 'WARNING':
        console.warn(`[${severity}] ${message} ${payload}`);
        break;
      default:
        console.log(`[${severity}] ${message} ${payload}`);
        break;
    }
  }
}
