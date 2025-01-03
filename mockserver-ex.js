const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Valid phone number
const noProspectCasePhone = '+14123453251';
const validCasePhone = '+14123453252';

const validOTP = '435234';

const successResponse = {
  error: {},
  result: {
    resultCount: 1,
    resultType: 'prefillResult',
    resultList: [
      {
        phone: '+14136363169',
        email: '',
        firstName: 'Rehan',
        middleName: 'Elahi',
        lastName: 'Hussain',
        fullName: 'Rehan Elahi Hussain',
        address: {
          line1: '46047 Woodpecker Sq',
          line2: '',
          city: 'Sterling',
          state: 'VA',
          postalCode: '20165',
          country: 'US',
        },
        birthDate: '1989-03-24',
        ssn: '',
        uuid: '1225efe9-7842-4d67-8271-737047793220',
      },
    ],
  },
};

// API to check if the phone number is valid
app.get('/prefill/v0/phone-numbers/:phoneNumber/check', (req, res) => {
  const { phoneNumber } = req.params;

  console.log('phone check: ', phoneNumber);

  if (phoneNumber === noProspectCasePhone || phoneNumber === validCasePhone) {
    return res.status(200).json({
      error: {},
      result: {
        resultCount: 1,
        resultType: 'phoneCheck',
        resultList: [
          {
            carrier: 'Verizon Wireless',
            phone: '+14136363169',
            formattedPhone: '(413) 636-3169',
            errorCode: '',
            type: 'mobile',
          },
        ],
      },
    });
  } else {
    return res.status(400).json({ isValid: false });
  }
});

// API to request OTP
app.post('/prefill/v0/mobile-numbers/:phoneNumber/challenge', (req, res) => {
  const { phoneNumber } = req.params;

  console.log('send otp: ', phoneNumber);

  if (phoneNumber === noProspectCasePhone || phoneNumber === validCasePhone) {
    return res
      .status(202)
      .json({ success: true, message: 'OTP sent successfully.' });
  }
  res
    .status(400)
    .json({ success: false, message: 'Invalid phone number for OTP.' });
});

// API to get user details
app.post('/prefill/v0/prospect/prefill', (req, res) => {
  const { phone, code, birthDate } = req.body;

  console.log('get user information');

  if (code !== validOTP) {
    return res.status(400).json({
      error: {
        errorCode: 'INVALID_CODE',
        errorMessage: 'The verification code provided was invalid',
      },
      result: {},
    });
  }

  if (phone === noProspectCasePhone && !birthDate) {
    return res.status(404).json({
      error: {
        errorCode: 'NO_PROSPECT_MATCH',
        errorMessage:
          'No prospect could be found with the information provided',
      },
      result: {},
    });
  }

  if (validCasePhone === phone) {
    return res.json(successResponse);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
