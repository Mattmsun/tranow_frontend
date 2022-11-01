import "react-credit-cards/es/styles-compiled.css";
import { useFormik, Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Button, TextField, ButtonBase } from "@mui/material";
import {
  updateUserPayment,
  deleteUserPayment,
  addUserPayment,
} from "../store/user";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { useRef, useState, useEffect, useMemo } from "react";
import { useValidateAddress } from "../customerHooks/useValidateAddress";
import Cards from "react-credit-cards";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData,
} from "../utilities/cardUtilities";

const SinglePayment = ({ payment, type, closeDialog, closeCardInfo }) => {
  const dispatch = useDispatch();

  const fullNameRegExp =
    /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;

  const handleCallback = ({ issuer }, isValid) => {
    // console.log(issuer);
    if (isValid) {
      formik.setValues({ ...formik.values, issuer: issuer });
    } else formik.setValues({ ...formik.values, issuer: "" });
  };

  const deletePayment = async () => {
    await dispatch(deleteUserPayment(payment.id));
    // await dispatch(paymentMethodDeleted(payment.id));
  };
  //transfer mm/yy to YYYY-MM-DD
  const dateFormat = (date) => {
    const dateArr = date.split("/");
    return `20${dateArr[1]}-${dateArr[0]}-1`;
  };
  const formik = useFormik({
    initialValues: {
      number: payment.account_number || "",
      name: payment.account_name || "",
      expiry: payment.expiry || "",
      cvc: "",
      issuer: payment.issuer || "",
    },

    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      number: Yup.string()
        .required("Required")
        .when("issuer", {
          is: (value) => value,
          then: Yup.string().required(),
          otherwise: Yup.string().length(25, "Must be a valide card number"),
        }),
      name: Yup.string()
        .required("Required")
        .matches(fullNameRegExp, "Name is not valid"),

      expiry: Yup.string()
        .typeError("Not a valid expiration date. Example: MM/YY")
        .min(4, "Not a valid expiration date. Example: MM/YY")
        .matches(
          /([0-9]{2})\/([0-9]{2})/,
          "Not a valid expiration date. Example: MM/YY"
        )
        .test(
          "test-credit-card-expiration-date",
          "Invalid Expiration Date ",
          (expirationDate) => {
            if (!expirationDate) {
              return false;
            }

            const today = new Date();
            const monthToday = today.getMonth() + 1;
            const yearToday = today.getFullYear().toString().slice(2, 4);

            const [expMonth, expYear] = expirationDate.split("/");

            if (Number(expYear) < Number(yearToday)) {
              return false;
            } else if (
              Number(expMonth) < monthToday &&
              Number(expYear) === Number(yearToday)
            ) {
              return false;
            }

            return true;
          }
        )
        .test(
          "test-credit-card-expiration-date",
          "Invalid Expiration Date",
          (expirationDate) => {
            if (!expirationDate) {
              return false;
            }

            const [expMonth] = expirationDate.split("/");

            if (Number(expMonth) > 12) {
              return false;
            }

            return true;
          }
        )
        .required("Expiration date is required"),
      cvc: Yup.string().required("Required").min(3).max(4),
    }),

    onSubmit: async (values, { resetForm }) => {
      const uploadPayment = {
        account_name: values.name,
        account_number: values.number,
        expiry: dateFormat(values.expiry),
        issuer: values.issuer,
      };
      if (type === "editCard") {
        await dispatch(updateUserPayment(payment.id, uploadPayment));
      }
      if (type === "addCard") {
        await dispatch(addUserPayment(uploadPayment));
        closeDialog();
        resetForm();
      }
    },
    onReset: () => {
      console.log("reset");
    },
  });
  formik.handleChange = ({ target }) => {
    // console.log(e);
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    formik.setValues({ ...formik.values, [target.name]: target.value });
  };

  //   console.log(payment);
  {
    return _.isEmpty(payment) ? null : (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item>
          <ButtonBase
            sx={{ borderRadius: "11px" }}
            onClick={closeCardInfo}
            disabled={type !== "editCard"}
          >
            <Cards
              cvc={formik.values.cvc}
              expiry={formik.values.expiry}
              //   focused={paymentInfo.focus}
              name={formik.values.name}
              number={formik.values.number}
              callback={handleCallback}
            />
          </ButtonBase>
        </Grid>

        <Grid item container>
          <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
            <Grid
              container
              item
              xs={12}
              direction="row"
              justifyContent="center"
              alignItems="baseline"
              spacing={3}
            >
              <Grid xs={8} item>
                <TextField
                  fullWidth
                  type="tel"
                  name="number"
                  placeholder="Card Number"
                  // onChange={handleInputChange}
                  // onFocus={handleInputFocus}
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.number && Boolean(formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                />
              </Grid>
              <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent="center"
                //   alignItems="baseline"
                spacing={3}
              >
                <Grid xs={8} item>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    placeholder="Name"
                    //   onChange={handleInputChange}
                    //   onFocus={handleInputFocus}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
              </Grid>
              <Grid xs={4} item>
                <TextField
                  fullWidth
                  type="tel"
                  name="expiry"
                  placeholder="Valid Thru"
                  value={formik.values.expiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.expiry && Boolean(formik.errors.expiry)}
                  helperText={formik.touched.expiry && formik.errors.expiry}
                />
              </Grid>
              <Grid xs={4} item>
                <TextField
                  fullWidth
                  type="tel"
                  name="cvc"
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  value={formik.values.cvc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cvc && Boolean(formik.errors.cvc)}
                  helperText={formik.touched.cvc && formik.errors.cvc}
                />
              </Grid>
              {type === "editCard" ? (
                <Grid
                  item
                  container
                  xs={8}
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                >
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      //   fullWidth
                      type="submit"
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={deletePayment}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              ) : null}

              {type === "addCard" ? (
                <Grid
                  item
                  container
                  xs={8}
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                >
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      //   fullWidth
                      type="submit"
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      // onClick={addressFormik.handleReset}
                      onClick={closeDialog}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
};

export default SinglePayment;
