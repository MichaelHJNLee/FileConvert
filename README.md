# PDF Converter

PDF Converter is a webpage where you can convert your PDF's into various image files (JPG, SVG, WEBP, PJPG, PNG).

## Installation

```bash
npm install
npm run build
npm start
```

## Design

This application utilizes two REST API endpoints:

  - POST '/api/verify'
    - The client sends a post request to this endpoint when the user interacts with the reCaptcha v2 module.
    - The endpoint sends a post request to the Google ReCaptcha API, verifying the user's interaction
    - The endpoint responds to the client with "Success" or "Failed captcha verification" based on the verification
    - The client will disable or enable the UI to convert PDF's based on this response

  - POST '/api/image/:type'
    - The client sends a post request to this endpoint when the user uploads a PDF and clicks the 'Convert' button
    - The endpoint sends a post request to the FileStack API, uploading the PDF
    - The endpoint then sends another request to the FileStack API, converting the uploaded PDF to the requested file type
    - The endpoint responds to the client with the url to the converted image
    - All requests made to the FileStack API must include a security policy and signature
