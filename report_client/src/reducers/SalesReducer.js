import { RECEIVE_SALES} from 'actions/ActionTypes';
import {initializeSales} from 'actions/SalesActions'
import {FORCE_SALES_UPDATE} from "actions/ActionTypes";

export default function sales(state =init(), action) {
	let newState;
	switch (action.type) {
		case RECEIVE_SALES:
			newState = action.data;
			console.log('RECEIVE_SALES Action');
			return newState;
		case FORCE_SALES_UPDATE:
			// Simply resets the state with a new version to force an update
			newState = {...state};
			console.log('FORCE_SALES_UPDATE Action');
			return newState;
		default:
			return state;
	}
}


function init() {
	return initializeSales()
}
