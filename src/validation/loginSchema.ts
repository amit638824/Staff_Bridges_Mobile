import * as Yup from "yup";

export const phoneSchema = Yup.object().shape({
  mobile: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  isChecked: Yup.boolean()
    .oneOf([true], "You must agree to the terms & conditions"),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{4,6}$/, "OTP must be 4-6 digits"),
});
