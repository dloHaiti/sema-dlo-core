export const CUSTOMER_SELECTED = 'CUSTOMER_SELECTED';
export const CUSTOMERS_LOADED = 'CUSTOMERS_LOADED';
export const CUSTOMERS_SET = 'CUSTOMERS_SET';
export const CUSTOMERS_SEARCH = 'CUSTOMERS_SEARCH';

import mock_customers from '../mock_data/customers';
import Communications from '../services/Communications';
import PosStorage from "../database/PosStorage";

export function CustomerSelected( customer){
	console.log("CustomerSelected - action");
	const data = customer;
	return (dispatch) => {
		dispatch({type: CUSTOMER_SELECTED, data:data});
	};
}
export function LoadCustomers( ) {
	console.log("LoadCustomers - action");
	let settings = PosStorage.getSettings();
	if( settings.useMockData ) {
		return (dispatch) => {
			setTimeout(() => {
				console.log("LoadCustomers - loaded");
				let customers = mock_customers;
				if (Array.isArray(mock_customers)) {
					customers = mock_customers.map(customer => {
						return {
							customerId: customer.id,
							address: customer.address,
							contactName: customer.contact_name,
							customer_type_id: customer.customer_type_id,
							dueAmount: customer.due_amount,
							name: customer.name,
							phoneNumber: customer.phone_number,
							active: customer.active,
							sales_channel: customer.sales_channel,
						}
					});
				}
				dispatch({ type: CUSTOMERS_LOADED, data: customers });
			}, 200);

		};
	}else{
		return (dispatch) => {
			Communications.getCustomers()
				.then( web_customers => {
					if (web_customers.hasOwnProperty("customers")) {
						dispatch({ type: CUSTOMERS_LOADED, data: web_customers.customers });
					}else{
						dispatch({ type: CUSTOMERS_LOADED, data: [] });
					}
				})
				.catch(error => {
					console.log( "LoadCustomers - error " + error);
					dispatch({ type: CUSTOMERS_LOADED, data: []});
				});

		}
	}
}

export function setCustomers( customers ) {
	console.log("setCustomers - action. No of customers " + customers.length);

	return (dispatch) => {dispatch({type: CUSTOMERS_SET, data:customers})};

}

export function SearchCustomers( searchString ) {
	console.log("SearchCustomers - action. Search is " + searchString);

	return (dispatch) => {dispatch({type: CUSTOMERS_SEARCH, data: searchString})};
}
