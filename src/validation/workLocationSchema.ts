import * as Yup from "yup";

export const workLocationSchema = Yup.object().shape({
  city: Yup.string().required("Please select a city"),
  locality: Yup.string().required("Please select a locality"),
});
