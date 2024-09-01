import { api } from "../../utils";


// Action Types
const CREATE_PRODCAST_REQUEST = "CREATE_PRODCAST_REQUEST";
const CREATE_PRODCAST_SUCCESS = "CREATE_PRODCAST_SUCCESS";
const CREATE_PRODCAST_FAIL = "CREATE_PRODCAST_FAIL";

const FETCH_ALL_PRODCASTS_REQUEST = "FETCH_ALL_PRODCASTS_REQUEST";
const FETCH_ALL_PRODCASTS_SUCCESS = "FETCH_ALL_PRODCASTS_SUCCESS";
const FETCH_ALL_PRODCASTS_FAIL = "FETCH_ALL_PRODCASTS_FAIL";

const FETCH_PRODCAST_BY_ID_REQUEST = "FETCH_PRODCAST_BY_ID_REQUEST";
const FETCH_PRODCAST_BY_ID_SUCCESS = "FETCH_PRODCAST_BY_ID_SUCCESS";
const FETCH_PRODCAST_BY_ID_FAIL = "FETCH_PRODCAST_BY_ID_FAIL";

const UPDATE_PRODCAST_REQUEST = "UPDATE_PRODCAST_REQUEST";
const UPDATE_PRODCAST_SUCCESS = "UPDATE_PRODCAST_SUCCESS";
const UPDATE_PRODCAST_FAIL = "UPDATE_PRODCAST_FAIL";

const DELETE_PRODCAST_REQUEST = "DELETE_PRODCAST_REQUEST";
const DELETE_PRODCAST_SUCCESS = "DELETE_PRODCAST_SUCCESS";
const DELETE_PRODCAST_FAIL = "DELETE_PRODCAST_FAIL";

const LIKE_PRODCAST_REQUEST = "LIKE_PRODCAST_REQUEST";
const LIKE_PRODCAST_SUCCESS = "LIKE_PRODCAST_SUCCESS";
const LIKE_PRODCAST_FAIL = "LIKE_PRODCAST_FAIL";

const COMMENT_ON_PRODCAST_REQUEST = "COMMENT_ON_PRODCAST_REQUEST";
const COMMENT_ON_PRODCAST_SUCCESS = "COMMENT_ON_PRODCAST_SUCCESS";
const COMMENT_ON_PRODCAST_FAIL = "COMMENT_ON_PRODCAST_FAIL";

const FETCH_PRODCASTS_BY_CATEGORY_REQUEST = "FETCH_PRODCASTS_BY_CATEGORY_REQUEST";
const FETCH_PRODCASTS_BY_CATEGORY_SUCCESS = "FETCH_PRODCASTS_BY_CATEGORY_SUCCESS";
const FETCH_PRODCASTS_BY_CATEGORY_FAIL = "FETCH_PRODCASTS_BY_CATEGORY_FAIL";

const FETCH_PRODCASTS_BY_SEARCH_QUERY_REQUEST = "FETCH_PRODCASTS_BY_SEARCH_QUERY_REQUEST";
const FETCH_PRODCASTS_BY_SEARCH_QUERY_SUCCESS = "FETCH_PRODCASTS_BY_SEARCH_QUERY_SUCCESS";
const FETCH_PRODCASTS_BY_SEARCH_QUERY_FAIL = "FETCH_PRODCASTS_BY_SEARCH_QUERY_FAIL";

const FETCH_PRODCASTS_BY_USER_REQUEST = "FETCH_PRODCASTS_BY_USER_REQUEST";
const FETCH_PRODCASTS_BY_USER_SUCCESS = "FETCH_PRODCASTS_BY_USER_SUCCESS";
const FETCH_PRODCASTS_BY_USER_FAIL = "FETCH_PRODCASTS_BY_USER_FAIL";


// Action Creators
export const createProdcast = (prodcastData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PRODCAST_REQUEST });
        const { data } = await api.post("/prodcasts", prodcastData);
        dispatch({ type: CREATE_PRODCAST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CREATE_PRODCAST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const fetchAllProdcasts = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_ALL_PRODCASTS_REQUEST });
        const { data } = await api.get("/prodcasts");
        dispatch({ type: FETCH_ALL_PRODCASTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_ALL_PRODCASTS_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const fetchProdcastById = (id) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODCAST_BY_ID_REQUEST });
        const { data } = await api.get(`/prodcasts/${id}`);
        dispatch({ type: FETCH_PRODCAST_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PRODCAST_BY_ID_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const updateProdcast = (id, prodcastData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODCAST_REQUEST });
        const { data } = await api.put(`/prodcasts/${id}`, prodcastData);
        dispatch({ type: UPDATE_PRODCAST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODCAST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const deleteProdcast = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODCAST_REQUEST });
        await api.delete(`/prodcasts/${id}`);
        dispatch({ type: DELETE_PRODCAST_SUCCESS, payload: id });
    } catch (error) {
        dispatch({
            type: DELETE_PRODCAST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const likeProdcast = (id) => async (dispatch) => {
    try {
        dispatch({ type: LIKE_PRODCAST_REQUEST });
        const { data } = await api.post(`/prodcasts/${id}/like`);
        dispatch({ type: LIKE_PRODCAST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: LIKE_PRODCAST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const commentOnProdcast = (id, comment) => async (dispatch) => {
    try {
        dispatch({ type: COMMENT_ON_PRODCAST_REQUEST });
        const { data } = await api.post(`/prodcasts/${id}/comment`, { comment });
        dispatch({ type: COMMENT_ON_PRODCAST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: COMMENT_ON_PRODCAST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const fetchProdcastsByCategory = (category) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODCASTS_BY_CATEGORY_REQUEST });
        const { data } = await api.get(`/prodcasts/category/${category}`);
        dispatch({ type: FETCH_PRODCASTS_BY_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PRODCASTS_BY_CATEGORY_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const fetchProdcastsBySearchQuery = (query) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODCASTS_BY_SEARCH_QUERY_REQUEST });
        const { data } = await api.get(`/prodcasts/search/${query}`);
        dispatch({ type: FETCH_PRODCASTS_BY_SEARCH_QUERY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PRODCASTS_BY_SEARCH_QUERY_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const fetchProdcastsByUser = (userId) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODCASTS_BY_USER_REQUEST });
        const { data } = await api.get(`/prodcasts/user/${userId}`);
        dispatch({ type: FETCH_PRODCASTS_BY_USER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_PRODCASTS_BY_USER_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

const initialState = {
    prodcasts: [],
    prodcast: null,
    loading: false,
    error: null,
};

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_PRODCAST_REQUEST:
        case FETCH_ALL_PRODCASTS_REQUEST:
        case FETCH_PRODCAST_BY_ID_REQUEST:
        case UPDATE_PRODCAST_REQUEST:
        case DELETE_PRODCAST_REQUEST:
        case LIKE_PRODCAST_REQUEST:
        case COMMENT_ON_PRODCAST_REQUEST:
        case FETCH_PRODCASTS_BY_CATEGORY_REQUEST:
        case FETCH_PRODCASTS_BY_SEARCH_QUERY_REQUEST:
        case FETCH_PRODCASTS_BY_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_PRODCAST_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcasts: [...state.prodcasts, action.payload],
            };
        case FETCH_ALL_PRODCASTS_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcasts: action.payload,
            };
        case FETCH_PRODCAST_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcast: action.payload,
            };
        case UPDATE_PRODCAST_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcasts: state.prodcasts.map((prodcast) =>
                    prodcast._id === action.payload._id ? action.payload : prodcast
                ),
            };
        case DELETE_PRODCAST_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcasts: state.prodcasts.filter(
                    (prodcast) => prodcast._id !== action.payload
                ),
            };
        case LIKE_PRODCAST_SUCCESS:
        case COMMENT_ON_PRODCAST_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcast: action.payload,
            };
        case FETCH_PRODCASTS_BY_CATEGORY_SUCCESS:
        case FETCH_PRODCASTS_BY_SEARCH_QUERY_SUCCESS:
        case FETCH_PRODCASTS_BY_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                prodcasts: action.payload,
            };
        case CREATE_PRODCAST_FAIL:
        case FETCH_ALL_PRODCASTS_FAIL:
        case FETCH_PRODCAST_BY_ID_FAIL:
        case UPDATE_PRODCAST_FAIL:
        case DELETE_PRODCAST_FAIL:
        case LIKE_PRODCAST_FAIL:
        case COMMENT_ON_PRODCAST_FAIL:
        case FETCH_PRODCASTS_BY_CATEGORY_FAIL:
        case FETCH_PRODCASTS_BY_SEARCH_QUERY_FAIL:
        case FETCH_PRODCASTS_BY_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};