import * as Yup from "yup";

export const phoneSchema = Yup.object().shape({
  mobile: Yup.string()
    .required("Phone number is required")
    .matches(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit mobile number"
    ),

  isChecked: Yup.boolean()
    .oneOf([true], "You must agree to the terms & conditions"),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});
