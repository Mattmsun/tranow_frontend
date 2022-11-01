import { useFormik, withFormik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

export const useValidateAddress = ({ userAddress }) => {
  const formik = useFormik({
    initialValues: {
      city: userAddress.city || "",
      country: userAddress.country || "",
      address: userAddress.address || "",
      phone: userAddress.phone || "",
      post_code: userAddress.post_code || "",
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      city: Yup.string().when("$manualAddress", (manualAddress, schema) =>
        !manualAddress ? schema.required("Required") : schema
      ),
      country: Yup.string().when("$manualAddress", (manualAddress, schema) =>
        manualAddress ? schema.required("Required") : schema
      ),
      phone: Yup.string().required("Required"),
      post_code: Yup.string().required("Required"),
      address: Yup.string().when("$manualAddress", (manualAddress, schema) =>
        manualAddress ? schema.required("Required") : schema
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      // if (!_.isEmpty(value)) {
      //   console.log(value);
      //   values.address = value.description;
      //   values.country = value.terms[value.terms.length - 1];
      //   values.city = value.terms[value.terms.length - 3];
      // }
      // const { id } = userAddress;
      // if (type === "manageOldAddress") {
      //   await dispatch(updateUserAddress(id, values));
      // }
      // if (type === "addNewaddress") {
      //   // await dispatch(addUserAddress(values));
      //   // closeDialog();
      //   // resetForm();
      //   console.log(values);
      // }
    },
    onReset: () => {},
  });
  return formik;
};

// export default useValidateAddress;
