// src/validation/aboutYourselfSchema.ts
import * as yup from "yup";

export const aboutYourselfSchema = yup.object().shape({
  fullName: yup.string().trim().required("Full Name is required"),
  gender: yup.string().required("Gender is required"),
  education: yup.string().required("Education is required"),
  experience: yup.string().required("Experience is required"),
  salary: yup
    .string()
    .matches(/^\d*$/, "Salary must be numeric")
    .nullable(),
});
