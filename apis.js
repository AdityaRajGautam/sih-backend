const BASE_URL = process.env.REACT_APP_BASE_URL

// AGENCY END POINTS
export const agencyEndPoints = {
    REGISTER_API: BASE_URL + "/agencyauth/register",
    LOGIN_API: BASE_URL + "/agencyauth/login",
    UPDATE_PASSWORD_API: BASE_URL + "agencyauth/updatepassword",
    UPDATE_AGENCY_INFO_API: BASE_URL + "agencyauth/update",
    GET_AGENCY_RESOURCE_AND_DISASTER_API: BASE_URL + "agencyauth/list/:id",
    GET_ALL_AGENCY_LOCATIONS_API: BASE_URL + "agencyauth/agencyLocations",
}

// RESOURCE END POINTS
export const resourceEndPoints = {
    CREATE_RESOURCE_API: BASE_URL + "/resourceauth/create",
    UPDATE_RESOURCE_API: BASE_URL + "/resourceauth/update/:id",
    GET_RESOURCE_API: BASE_URL + "resourceauth/getResources/:resourceName",
    LIST_RESOURCES_API: BASE_URL + "resourceauth/listResources",
    STATUS_OF_RESOURCES_API: BASE_URL + "resourceauth/statusOfResources",
    SHARE_RESOURCES_API: BASE_URL + "resourceauth/shareResources",
    DELETE_RESOURCES_API: BASE_URL + "resourceauth/deleteResource/:resourceId",
}

// DISASTER END POINTS
