import React from 'react';
import './AuthScreen.css';

const AuthScreen = ({ onAuthenticate, onSkip, error, loading, deviceInfo }) => {
  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo.png" alt="Taha Association" className="auth-logo-img" />
          </div>
          <h1>Taha Association</h1>
          <h2>Management Interface</h2>
        </div>

        <div className="auth-content">
          {deviceInfo?.isMobile ? (
            <>
              <div className="auth-icon">
                {deviceInfo?.hasSupport ? (
                  <div className="biometric-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="passcode-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="auth-message">
                <h3>Secure Access Required</h3>
                <p>
                  {deviceInfo?.hasSupport
                    ? 'Use Face ID, Touch ID, or your device passcode to access the management interface.'
                    : 'Use your device passcode to access the management interface.'}
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="auth-actions">
                <button
                  className="auth-button primary"
                  onClick={onAuthenticate}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="auth-spinner">
                      <div className="spinner"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M21 12H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        {deviceInfo?.hasSupport ? 'Authenticate' : 'Enter Passcode'}
                      </span>
                    </>
                  )}
                </button>

                <button className="auth-button secondary" onClick={onSkip}>
                  <span>Continue without authentication</span>
                </button>
              </div>
            </>
          ) : (
            <div className="desktop-message">
              <div className="desktop-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 17H7A5 5 0 017 7h2m8 0h2a5 5 0 015 5 5 5 0 01-5 5h-2m-5-5h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Desktop Access</h3>
              <p>Biometric authentication is available on mobile devices only.</p>
              <button className="auth-button primary" onClick={onSkip}>
                <span>Continue to Interface</span>
              </button>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p>Secure access to Taha Association management tools</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;