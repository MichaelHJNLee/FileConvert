# PDF Converter

PDF Converter is a webpage where you can convert your PDF's into various image formats (JPG, SVG, WEBP, PJPG, PNG).
This application is currently deployed onto an AWS EC2 instance and can be accessed on http://ec2-54-241-141-253.us-west-1.compute.amazonaws.com:3000/.

## Installation

```bash
npm install
npm start
```
*IMPORTANT* 
The reCaptcha v2 in this application is only functional at the url where this application is currently deployed. If you would like to use this application locally without the reCaptcha v2, follow the steps below:
  - Navigate to src/components/App.jsx
  - Change this.state.captcha in the constructor of class App to true
  - Save and run the command 'npm run build'
  - Run the command 'npm start'
This process will enable the 'Convert' button to allow use without reCaptcha v2 verification.

## Design

This application utilizes two REST API endpoints:

  - POST '/api/verify'
    - The client sends a post request to this endpoint when the user interacts with the reCaptcha v2 module.
    - The endpoint sends a post request to the Google reCaptcha API, verifying the user's interaction
    - The endpoint responds to the client with "Success" or "Failed captcha verification" based on the verification
    - The client will disable or enable the UI to convert PDF's based on this response

  - POST '/api/image/:type'
    - The client sends a post request to this endpoint when the user uploads a PDF and clicks the 'Convert' button
    - The endpoint sends a post request to the FileStack API, uploading the PDF
    - The endpoint then sends another request to the FileStack API, converting the uploaded PDF to the requested file type
    - The endpoint responds to the client with the url to the converted image
    - All requests made to the FileStack API from this endpoint must include a correct security policy and signature

Steps to Use:
  - Select the PDF you would like to convert
  - Select desired output format
  - Complete reCaptcha v2 verification
  - Click 'Convert' button
  - Converted file will be displayed

Notes:
  - If a user has not picked a file, the website will alert the user to pick a file
  - If a user has not selected a PDF file, the website will alert the user that only PDF files are allowed
  - If the captcha verification has not succeeded, the convert button will remain disabled
  - If the captcha verification expires, the convert button will revert to being disabled
  - The JavaScript SDK 'filestack-js' was used to communicate with the FileStack API, and it was not used to implement any FileStack pickers or transform UI.