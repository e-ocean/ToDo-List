// import { format } from 'date-fns';
// import { add } from 'date-fns'

import {initialState, initializeEventListeners} from './domHandler';
// import './style.css';


document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initialState()
});


