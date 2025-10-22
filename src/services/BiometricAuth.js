/**
 * Biometric Authentication Service
 * Handles Face ID, Touch ID, and device passcode authentication
 */

class BiometricAuth {
  constructor() {
    this.isSupported = this.checkSupport();
  }

  /**
   * Check if biometric authentication is supported
   */
  checkSupport() {
    // Check for WebAuthn support
    if (!window.PublicKeyCredential) {
      return false;
    }

    // Check for user verification methods
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  /**
   * Detect if the device is mobile
   */
  isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile user agents
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check screen size (mobile-like dimensions)
    const smallScreen = window.screen.width <= 768 || window.screen.height <= 768;
    
    return mobileRegex.test(userAgent) || (hasTouch && smallScreen);
  }

  /**
   * Check if device has biometric capabilities
   */
  async hasBiometricSupport() {
    try {
      if (!this.isSupported) return false;
      
      // Check if user verifying platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }

  /**
   * Create authentication challenge
   */
  createChallenge() {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    return challenge;
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate() {
    try {
      if (!this.isMobileDevice()) {
        throw new Error('Biometric authentication is only available on mobile devices');
      }

      const hasSupport = await this.hasBiometricSupport();
      if (!hasSupport) {
        throw new Error('Biometric authentication is not available on this device');
      }

      const challenge = this.createChallenge();
      
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'required',
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        }
      };

      // For existing users, we'll try to authenticate
      // For new users, we might need to register first
      let credential;
      
      try {
        // Try to authenticate with existing credentials
        credential = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions
        });
      } catch (error) {
        // If no existing credential, create one
        if (error.name === 'NotAllowedError' || error.name === 'InvalidStateError') {
          credential = await this.register();
        } else {
          throw error;
        }
      }

      if (credential) {
        // Store authentication state
        localStorage.setItem('biometric_auth', JSON.stringify({
          authenticated: true,
          timestamp: Date.now(),
          credentialId: credential.id
        }));
        
        return {
          success: true,
          credential: credential
        };
      }

      throw new Error('Authentication failed');

    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Register new biometric credential
   */
  async register() {
    try {
      const challenge = this.createChallenge();
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "Taha Association Management",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: "user@tahaassociation.com",
          displayName: "Taha Association User",
        },
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        // Store the credential info
        localStorage.setItem('biometric_credential', JSON.stringify({
          id: credential.id,
          registered: true,
          timestamp: Date.now()
        }));
      }

      return credential;

    } catch (error) {
      console.error('Biometric registration error:', error);
      throw error;
    }
  }

  /**
   * Check if user is already authenticated
   */
  isAuthenticated() {
    try {
      const authData = localStorage.getItem('biometric_auth');
      if (!authData) return false;

      const auth = JSON.parse(authData);
      const now = Date.now();
      const authAge = now - auth.timestamp;
      
      // Authentication expires after 24 hours
      const expirationTime = 24 * 60 * 60 * 1000;
      
      return auth.authenticated && authAge < expirationTime;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  /**
   * Clear authentication state
   */
  logout() {
    localStorage.removeItem('biometric_auth');
    localStorage.removeItem('biometric_credential');
  }

  /**
   * Get device capabilities info
   */
  async getDeviceInfo() {
    const isMobile = this.isMobileDevice();
    const hasSupport = await this.hasBiometricSupport();
    
    return {
      isMobile,
      hasSupport,
      userAgent: navigator.userAgent,
      hasTouch: 'ontouchstart' in window,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
  }
}

export default BiometricAuth;