import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByDistanceChart extends Component {
    render() {
        return (
			<div className = "ChartContainer" >
        		<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
					<Pie
						data = {this.getCustomerData()}
						// data = {{
						// labels: ["Walkup", "Reseller"],
						// datasets: [
						// 	{
						// 		label: "Walkup",
						// 		backgroundColor: ["rgba(99,255,132,0.2)", "rgba(99,132,255,0.2)" ],
						// 		data: [55, 90 ],
						// 	}
						// ]
						// }}
						height={300}
						width={500}
						options={{
							title: {
								display: true,
								text: this.getChartText(),
								position:"top"
							},
							legend:{
								position:"right"
							}


						}}
					/>
				</div>
			</div>

        );
    }
	getCustomerData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByDistance')){

				data.datasets.push( {label: "", backgroundColor:[], data:[]});
				let index = 0;
				this.props.chartData.customerInfo.customersByDistance.forEach(distance => {
					if (distance.hasOwnProperty("distanceLessThan") && distance.hasOwnProperty("distanceGreaterThan")) {
						let label = "" + distance.distanceGreaterThan + " - " + distance.distanceLessThan + " M" ;
						data.labels.push(label);
					} else if (distance.hasOwnProperty("distanceLessThan")) {
						data.labels.push("<" + distance.distanceLessThan + " M" );
					} else if (distance.hasOwnProperty("distanceGreaterThan")) {
						data.labels.push(">" + distance.distanceGreaterThan + " M");
					}

					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(distance.customerCount );
					index++;
				});
			}
		}
		return data;
	}
	getChartText( ) {
		return "Customers By Distance";
	}
}
export default CustomersByDistanceChart;
