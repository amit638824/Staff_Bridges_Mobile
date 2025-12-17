// src/validation/profileSchema.ts
import * as Yup from 'yup';

export const profileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('profile_validation_fullname')
    .min(3, 'profile_validation_fullname_min3'),

  phone: Yup.string()
    .required('profile_validation_phone')
    .matches(/^[0-9]{10}$/, 'profile_validation_phone_10digit'),

  location: Yup.string()
    .required('profile_validation_location'),

  experience: Yup.string()
    .required('profile_validation_experience'),

  skills: Yup.array()
    .min(1, 'profile_validation_skills_required'),

  salary: Yup.string()
    .required('profile_validation_salary'),

  email: Yup.string()
    .email('profile_validation_email_invalid')
    .required('profile_validation_email'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'profile_validation_gender')
    .required('profile_validation_gender'),

  education: Yup.string()
    .required('profile_validation_education'),
});


export const additionalDetailsSchema = Yup.object().shape({
  email: Yup.string()
    .transform(value => (value === '' ? undefined : value))
    .matches(
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
      'profile_validation_email_invalid'
    )
    .required('profile_validation_email'),

  alternateMobile: Yup.string()
    .matches(/^[6-9][0-9]{9}$/, 'profile_validation_phone_10digit')
    .nullable(),

  salary: Yup.string()
    .required('profile_validation_salary'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'profile_validation_gender')
    .required('profile_validation_gender'),

  education: Yup.string()
    .required('profile_validation_education'),
});
