const BASE_URL = 'http://192.168.232.205:8080/api/';

export default {
    URL_USER_CREATE : BASE_URL + 'auth/signup',
    URL_USER_LOGIN : BASE_URL + 'auth/login',
    URL_GET_ALL_EVENTS : BASE_URL + 'events/',
    URL_GET_EVENTS_CURRENT_MONTH : BASE_URL + 'events/',
    URL_JOIN_EVENT : BASE_URL + 'events/join',
    URL_UNREGISTER_EVENT : BASE_URL + 'events/unregister',
    URL_DONATE_EVENT : BASE_URL + 'events/donate',
    URL_DONATIONS_USER : BASE_URL + 'events/donations/'
}