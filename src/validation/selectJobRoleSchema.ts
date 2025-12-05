import * as Yup from "yup";

export const selectJobRoleSchema = Yup.object().shape({
  selectedRoles: Yup.array()
    .min(1, "Please select at least one role")
    .max(4, "You can select up to 4 roles only"),
});
