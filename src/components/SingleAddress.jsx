import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Box,
  Divider,
  Switch,
} from "@mui/material";
import {
  updateUserAddress,
  addUserAddress,
  deleteUserAddress,
} from "../store/user";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRef, useState, useEffect, useMemo } from "react";
import { useValidateAddress } from "../customerHooks/useValidateAddress";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };
const postcodeRegExp = /\d{4}/;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const SingleAddress = ({ userAddress, type, closeDialog }) => {
  const addressFormik = useValidateAddress({ userAddress });
  // const handleReset = () => {};
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      city: userAddress.city || "",
      country: userAddress.country || "",
      address: userAddress.address || "",
      phone: userAddress.phone || "",
      post_code: userAddress.post_code || "",
      addManualAddress: false,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      addManualAddress: Yup.boolean(),
      city: Yup.string().when("addManualAddress", {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      }),
      country: Yup.string().when("addManualAddress", {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      }),
      phone: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid"),
      post_code: Yup.string()
        .required("Required")
        .matches(postcodeRegExp, "Post code is not valid"),
      address: Yup.string().when("addManualAddress", {
        is: true,
        then: Yup.string().required(),
        otherwise: Yup.string(),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      if (!_.isEmpty(value) && value.description) {
        // console.log(value);
        values.address = value.description;
        values.country = value.terms[value.terms.length - 1].value;
        values.city = value.terms[value.terms.length - 3].value;
      }

      const { id } = userAddress;
      const updateAddress = _.pick(values, [
        "city",
        "country",
        "phone",
        "address",
        "post_code",
      ]);
      // console.log(updateAddress);
      if (type === "manageOldAddress") {
        const result = await dispatch(updateUserAddress(id, updateAddress));
        closeDialog();
        // console.log(result);
      }
      if (type === "addNewaddress") {
        await dispatch(addUserAddress(updateAddress));
        closeDialog();
        resetForm();
        // console.log(updateAddress);
      }
      // resetForm();
    },
    onReset: () => {
      console.log("reset");
    },
  });

  const handleManualAddress = () => {
    setManualAddress(!manualAddress);
    formik.setFieldValue("addManualAddress", !formik.values.addManualAddress);
  };
  const deleteAddress = async () => {
    await dispatch(deleteUserAddress(userAddress.id));
  };

  const [manualAddress, setManualAddress] = useState(false);
  const [value, setValue] = useState(userAddress.address);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  useEffect(() => {
    // console.log("render");
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
        // types: ["(cities)"]
        // language: "zh",
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  // console.log(value);

  // console.log(manualAddress);
  // console.log(formik.values);
  {
    return !_.isEmpty(userAddress) ? (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid
          item
          container
          xs={12}
          justifyContent="center"
          alignItems="center"
        >
          {!manualAddress && (
            <Grid item xs={8}>
              <Autocomplete
                fullWidth
                id="google-map-demo"
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                onChange={(event, newValue) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose your location"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => {
                  if (option.structured_formatting) {
                    const matches =
                      option.structured_formatting.main_text_matched_substrings;
                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match) => [
                        match.offset,
                        match.offset + match.length,
                      ])
                    );

                    return (
                      <li {...props}>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Box
                              component={LocationOnIcon}
                              sx={{ color: "text.secondary", mr: 2 }}
                            />
                          </Grid>
                          <Grid item xs>
                            {parts.map((part, index) => (
                              <span
                                key={index}
                                style={{
                                  fontWeight: part.highlight ? 700 : 400,
                                }}
                              >
                                {part.text}
                              </span>
                            ))}

                            <Typography variant="body2" color="text.secondary">
                              {option.structured_formatting.secondary_text}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                    );
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
        <Grid item container>
          <form
            context={{ manualAddress }}
            style={{ width: "100%" }}
            onSubmit={formik.handleSubmit}
          >
            <Grid
              container
              item
              xs={12}
              direction="row"
              justifyContent="center"
              alignItems="baseline"
              spacing={2}
            >
              <Grid align="center" item xs={12}>
                <Button
                  size="small"
                  color={manualAddress ? "primary" : "error"}
                  // onClick={() => setManualAddress(!manualAddress)}
                  onClick={handleManualAddress}
                >
                  <Typography>
                    {manualAddress
                      ? `Back to set address automatically`
                      : `Cannot find address? Manually set`}
                  </Typography>
                </Button>
                <Switch
                  // name="addManualAddress"
                  // id="addManualAddress"
                  checked={formik.values.addManualAddress}
                  color={manualAddress ? "primary" : "error"}
                  onChange={handleManualAddress}
                />
              </Grid>
              {manualAddress && (
                <>
                  <Grid xs={4} item>
                    <TextField
                      label="City"
                      placeholder="Which city are you in"
                      fullWidth
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      placeholder="Which country are you in"
                      label="Country"
                      fullWidth
                      id="country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.country && Boolean(formik.errors.country)
                      }
                      helperText={
                        formik.touched.country && formik.errors.country
                      }
                    />
                  </Grid>
                  <Grid xs={8} item>
                    <TextField
                      placeholder="Detailed home address"
                      label="Address"
                      fullWidth
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.address && Boolean(formik.errors.address)
                      }
                      helperText={
                        formik.touched.address && formik.errors.address
                      }
                    />
                  </Grid>
                </>
              )}

              <Grid xs={5.5} item>
                <TextField
                  placeholder="Phone number"
                  label="phone"
                  fullWidth
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid xs={2.5} item>
                <TextField
                  placeholder="Post Code"
                  label="Post Code"
                  fullWidth
                  id="post_code"
                  name="post_code"
                  value={formik.values.post_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.post_code && Boolean(formik.errors.post_code)
                  }
                  helperText={
                    formik.touched.post_code && formik.errors.post_code
                  }
                />
              </Grid>
              {type === "manageOldAddress" ? (
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
                      onClick={deleteAddress}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
              {type === "addNewaddress" ? (
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
    ) : null;
  }
};

export default SingleAddress;
