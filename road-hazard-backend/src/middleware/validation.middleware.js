import { body, validationResult } from 'express-validator'

export const validatePhone = [
  body('phone')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
export const validateLocation = [
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
    validateResults
  ]
  
  export const validateReport = [
    body('hazard_type_id')
      .isInt()
      .withMessage('Invalid hazard type'),
    body('location_id')
      .isInt()
      .withMessage('Invalid location'),
    body('speed_at_reporting')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Invalid speed'),
    validateResults
  ]
  
  function validateResults(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }