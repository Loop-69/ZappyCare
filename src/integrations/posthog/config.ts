
import posthog from 'posthog-js';

export const initializePostHog = () => {
  // Only initialize in production environments
  if (import.meta.env.PROD) {
    // You would replace this with your actual PostHog API key if you have one
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY || 'phc_placeholder';
    
    posthog.init(apiKey, {
      api_host: 'https://app.posthog.com',
      // Adjust these settings to reduce rate limiting warnings
      capture_pageview: false, // Only capture pageviews manually
      disable_session_recording: true, // Disable session recording if not needed
      autocapture: false, // Disable autocapture
      capture_performance: false, // Disable performance metrics
      advanced_disable_decide: true, // Disable decide endpoint requests
    });
    
    console.log('PostHog initialized with custom rate limiting settings');
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD && posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
};
