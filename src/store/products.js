import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";
import _ from "lodash";

const slice = createSlice({
  name: "products",
  // initialState: [],
  initialState: {
    list: [],
    top: [],
    categoryTop: [],
    topSeller: [],
    category: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    itemAdded: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        cart.list[index].quantity++;
        return;
      }
      cart.list.push(product);
    },
    itemRemoved: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex((item) => item.id === product.id);
      if (cart.list[index].quantity === 1) {
        cart.list.splice(index, 1);
        return;
      }
      cart.list[index].quantity--;
    },
    productsRequested: (products, action) => {
      products.loading = true;
    },
    productsReceived: (products, action) => {
      products.list = action.payload;
      products.loading = false;
      products.lastFetch = Date.now();
    },

    topProductsReceived: (products, action) => {
      products.top = action.payload;
      products.loading = false;
      // products.lastFetch = Date.now();
    },
    topCategoryProductsReceived: (products, action) => {
      const { categoryId, products: loadedProducts } = action.payload;
      const index = products.categoryTop.findIndex(
        (p) => p.categoryId === categoryId
      );
      if (index !== -1) {
        products.categoryTop[index].products = loadedProducts;
        products.loading = false;
        return;
      }
      products.categoryTop.push(action.payload);
      products.loading = false;
      // products.lastFetch = Date.now();
    },
    productsRequestFailed: (products, action) => {
      products.loading = false;
    },
    productCategoryReceived: (products, action) => {
      products.category = action.payload;
      products.loading = false;
      // products.lastFetch = Date.now();
    },
    topSellerProductsReceived: (products, action) => {
      products.topSeller = action.payload;
      products.loading = false;
      // products.lastFetch = Date.now();
    },
  },
});

const productUrl = "/api/products";
const categoryUrl = "api/productCategories";

export const loadProducts = () => (dispatch, getState) => {
  const token = JSON.parse(window.localStorage.getItem("token"));
  // if (!token) {
  //   const { lastFetch } = getState().entities.products;
  //   const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  //   if (diffInMinutes < 10) return;
  // }

  return dispatch(
    apiCallBegan({
      url: token ? `${productUrl}/loginUserProducts` : productUrl,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};

export const loadTopProducts = (topNumber) => (dispatch, getState) => {
  const token = JSON.parse(window.localStorage.getItem("token"));
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: token
        ? `${productUrl}/logintopProducts/${topNumber}`
        : `${productUrl}/topProducts/${topNumber}`,
      onStart: productsRequested.type,
      onSuccess: topProductsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};

export const loadTopCategoryProducts =
  (topNumber, categoryId) => (dispatch, getState) => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    // const { lastFetch } = getState().entities.cart;

    // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    // if (diffInMinutes < 10) return;
    return dispatch(
      apiCallBegan({
        url: token
          ? `${productUrl}/logintopCategoryProducts/${topNumber}/${categoryId}/`
          : `${productUrl}/topCategoryProducts/${topNumber}/${categoryId}`,
        onStart: productsRequested.type,
        onSuccess: topCategoryProductsReceived.type,
        onError: productsRequestFailed.type,
      })
    );
  };
export const loadTopSellerProducts = (topNumber) => (dispatch, getState) => {
  const token = JSON.parse(window.localStorage.getItem("token"));
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: token ? `${productUrl}/loginTopSeller` : `${productUrl}/topSeller`,
      onStart: productsRequested.type,
      onSuccess: topSellerProductsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};
export const loadCategory = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: categoryUrl,
      onStart: productsRequested.type,
      onSuccess: productCategoryReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};
export const getProducts = createSelector(
  (state) => state.entities.products,
  (products) => products.list
);

export const getItemQuantity = createSelector(
  (state) => state.entities.cart,
  (cart) => {
    let sum = 0;
    if (cart.list.length !== 0) {
      for (let item of cart.list) {
        sum = sum + item.quantity;
      }
    }
    return sum;
  }
);

export const getCategory = createSelector(
  (state) => state.entities.products,
  (products) => products.category
);

export const getProductsByCategory = (category) => {
  return createSelector(
    (state) => state.entities.products,
    (products) =>
      products.list.filter((product) => product.category === category)
  );
};
export const getProductsBySeller = (user_id) => {
  return createSelector(
    (state) => state.entities.products,
    (products) => products.list.filter((product) => product.user_id === user_id)
  );
};

export const getTopProducts = () => {
  return createSelector(
    (state) => state.entities.products,
    (products) => products.top
  );
};
export const getProductsByCategoryId = (id) => {
  return createSelector(
    (state) => state.entities.products,
    (products) => products.list.filter((product) => product.category_id === id)
  );
};
export const getLoadingStatus = () => {
  return createSelector(
    (state) => state.entities.products,
    (products) => products.loading
  );
};
export const getTopCategoryProducts = (categoryId) => {
  return createSelector(
    (state) => state.entities.products,
    (products) => {
      const result = products.categoryTop.filter(
        (c) => c.categoryId === categoryId
      );
      if (!_.isEmpty(result)) return result[0].products;
      else return {};
    }
  );
};
export const getTopSellerProducts = () => {
  return createSelector(
    (state) => state.entities.products,
    (products) => products.topSeller
  );
};
export const {
  productsRequested,
  productsRequestFailed,
  productsReceived,
  productCategoryReceived,
  topProductsReceived,
  topCategoryProductsReceived,
  topSellerProductsReceived,
} = slice.actions;
export default slice.reducer;
