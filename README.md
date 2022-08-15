# Documentation

## Node.js

This repository contains the sample files from the Node.js documentation.

### Frontend

- **PasskeyService.js**: contains a frontend service to sign up and login, which mainly communicates with the backend
  and
  calls the WebAuthn API
- **utils_frontend.js**: contains a helper function to check if the user's device can use passkeys

### Backend

- **CorbadoService.js**: contains a backend service to provide basic passkeys sign up and login via Corbado API
- **CorbadoServiceExtension.js**: contains a backend service to provide passkeys sign up (with email magic link confirmation) and
  login via Corbado API
- **CorbadoEmailService.js**: contains a backend service that provides email magic link authentication via Corbado API
- **CorbdoSmsService.js**: contains a backend service that provides SMS OTP authentication via Corbado API
- **utils_backend.js**: contains a function to extract client information required for Corbado API