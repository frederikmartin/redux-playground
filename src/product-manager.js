import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';

// Pages
export const DETAILS = "DETAILS";
export const AVAILABILITY = "AVAILABILITY";

// Requests
export const READY = "READY";
export const WAITING = "WAITING";
export const PRODUCT_UPDATE_ACCEPTED = "PRODUCT_UPDATE_ACCEPTED";

// Actions
export const CHANGE_PAGE = "CHANGE_PAGE";
export const CHANGE_PRODUCT = "CHANGE_PRODUCT";
export const CHANGE_PRODUCT_DIRTY = "CHANGE_PRODUCT_DIRTY";

const defaultState = {
    page: {
        name: DETAILS,
        title: "Product Details"
    },
    product: {
        name: "Best Product ever!",
        inStock: true
    },
    productDirty: false,
    requestStatus: READY
};

// Reducer
const pageReducer = (state = defaultState.page, { type, value, title }) => {
    switch (type) {
        case CHANGE_PAGE:
            const newState = { name: value, title };
            return newState;
        default:
            return state;
    }
};
const productReducer = (state = defaultState.product, { type, value, inStock }) => {
    switch (type) {
        case CHANGE_PRODUCT:
            const newState = { name: value, inStock };
            return newState;
        default:
            return state;
    }
};
const productDirtyReducer = (state = defaultState.productDirty, { type, value }) => {
    switch (type) {
        case CHANGE_PRODUCT_DIRTY:
            return value;
        default:
            return state;
    }
};

const combinedReducers = combineReducers({
    page: pageReducer,
    product: productReducer,
    productDirty: productDirtyReducer
});

const store = createStore(
    combinedReducers,
    applyMiddleware(logger())
);

// Content components
const DetailsComponent = ({ title, name }) => (
    `<h3>${title}</h3>
    <form name="details">
        <label for="name">Name</label>
        <input type="text" name="productName" value="${name}">
    </form>`
);
const AvailabilityComponent = ({ title, inStock }) => (
    `<h3>${title}</h3>
    <form name="availability">
        <label for="name">
            <input type="checkbox" name="inStock" value="inStock" ${inStock ? 'checked' : ''}> In Stock
        </label>
    </form>`
);

// Render method for view
const render = () => {
    const { page, product, productDirty, requestStatus } = store.getState();

    // Set product title in navbar
    document.getElementById("product-title").innerHTML = product.name;

    // Set active nav element
    const btnDetails = document.getElementById("btn-details");
    const btnAvailability = document.getElementById("btn-availability");
    btnDetails.classList.remove("active");
    btnAvailability.classList.remove("active");
    switch (page.name) {
        case DETAILS:
            document.getElementById("btn-details").classList.add("active");
            break;
        case AVAILABILITY:
            document.getElementById("btn-availability").classList.add("active");
            break;
        default:
    }

    // Disable save button if request in progress
    document.getElementById("btn-save").disabled = !productDirty || requestStatus === WAITING;

    // Set content
    let renderedContent;
    switch (page.name) {
        case DETAILS:
            renderedContent = DetailsComponent({
                title: page.title,
                name: product.name
            });
            break;
        case AVAILABILITY:
            renderedContent = AvailabilityComponent({
                title: page.title,
                inStock: product.inStock
            });
            break;
        default:
    }
    document.getElementById("content").innerHTML = renderedContent;

    // Event listener
    switch (page.name) {
        case DETAILS:
            document.forms.details.productName.addEventListener("blur", (event) => {
                event.preventDefault();

                // Make product dirty
                if (!productDirty) {
                    store.dispatch(changeProductDirtyAction(true));
                }

                store.dispatch(changeProductAction(
                    event.target.value,
                    product.inStock
                ));
            });
            break;
        case AVAILABILITY:
            document.forms.availability.inStock.addEventListener("change", (event) => {
                event.preventDefault();

                // Make product dirty
                if (!productDirty) {
                    store.dispatch(changeProductDirtyAction(true));
                }

                store.dispatch(changeProductAction(
                    product.name,
                    event.target.checked
                ));
            });
            break;
        default:
    }
};

// Actions
const changePageAction = (name, title) => {
    return {
        type: CHANGE_PAGE,
        value: name,
        title: title
    };
};
const changeProductAction = (name, inStock) => {
    return {
        type: CHANGE_PRODUCT,
        value: name,
        inStock
    };
};
const changeProductDirtyAction = (value) => {
    return {
        type: CHANGE_PRODUCT_DIRTY,
        value
    };
};

// Event listener
document.getElementById("btn-details-link").addEventListener("click", (event) => {
    event.preventDefault();

    const currentState = store.getState().page.name;
    if (currentState === DETAILS) return;

    store.dispatch(changePageAction(
        DETAILS,
        "Product Details"
    ));
});
document.getElementById("btn-availability-link").addEventListener("click", (event) => {
    event.preventDefault();

    const currentState = store.getState().page.name;
    if (currentState === AVAILABILITY) return;

    store.dispatch(changePageAction(
        AVAILABILITY,
        "Product Availability"
    ));
});
document.getElementById("btn-save").addEventListener("click", (event) => {
    event.preventDefault();

    store.dispatch(changeProductDirtyAction(false));
});

render();

// Subscriptions
store.subscribe(render);
