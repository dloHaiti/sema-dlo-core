import React, { Component } from 'react';
import {Bar, HorizontalBar} from 'react-chartjs-2';

class WaterVolumeChannelAndIncomeChart extends Component {
    render() {
        return (<div className = "chart">
                <HorizontalBar
					data = {this.getVolumeData()}
				// 	data = {{
				// 	labels: ["$8< per day", "$8<$5 per day", "$5<$2 per day", "<$2 per day"],
				// 	datasets: [
				// {
				// 	label: "Walkup",
				// 	backgroundColor: "rgba(99,255,132,0.2)",
				// 	data: [29, 39, 49, 59],
				// 	stack: 1
				// },
				// {
				// 	label: "Reseller",
				// 	backgroundColor: "rgba(99,132,255,0.2)",
				// 	data: [80, 60, 40, 20],
				// 	stack: 1
				// },
				// 	]
				// }}
                    height={300}
                    width={500}
                    options={{
                        maintainAspectRatio: false,
						scales: {
							xAxes: [{ stacked: true }],
						},
                        title: {
                            display: true,
                            text: 'Liters by Channel and Income',
                            position:"top"
                        }

                    }}
                />
            </div>
        );
    }
	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.volume.volumeInfo.hasOwnProperty('volumeByChannel')){
				if( this.props.chartData.volume.volumeInfo.volumeByChannelAndIncome.length > 0 ) {
					// Create the bars
					this.props.chartData.volume.volumeInfo.volumeByChannelAndIncome.forEach(channelAndIncome => {
						if (channelAndIncome.hasOwnProperty("incomeLessThan") && channelAndIncome.hasOwnProperty("incomeGreaterThan")) {
							let label = "$" + channelAndIncome.incomeGreaterThan + "<$" + channelAndIncome.incomeLessThan + " per day";
							data.labels.push(label);
						} else if (channelAndIncome.hasOwnProperty("incomeLessThan")) {
							data.labels.push("$" + channelAndIncome.incomeLessThan + "< per day");
						} else if (channelAndIncome.hasOwnProperty("incomeGreaterThan")) {
							data.labels.push("$" + channelAndIncome.incomeGreaterThan + "> per day");
						}
					});

					// Create the labels
					let index = 0;
					this.props.chartData.volume.volumeInfo.volumeByChannelAndIncome[0].volume.data.forEach(salesChannel => {
						data.datasets.push( {label: salesChannel.salesChannel, data:[], stack: 1, backgroundColor:this.getBackgroundColor( index ), id: salesChannel.salesChannel});
						index++;
					});
					// add the data
					this.props.chartData.volume.volumeInfo.volumeByChannelAndIncome.forEach(channelAndIncome => {
						channelAndIncome.volume.data.forEach( dataPt =>{
							this.addData( data.datasets, dataPt );
						});

					});

					console.log("==========Volume data loaded: " + this.props.chartData.loaded);

				}
			}
		}
		return data;
	}
	addData( dataSets, dataPt ){
    	for( let index = 0; index < dataSets.length; index++){
    		if(dataSets[index].id == dataPt.salesChannel ){
				dataSets[index].data.push( dataPt.volume );
				return
			}
		}
	}
	getBackgroundColor (index ){
    	switch( index ){
			case 0:
				return "rgba(99,132,255,0.2)";
			case 1:
				return "rgba(99,255,132,0.2)";
			default:
				return "rgba(0,0,255,0.2)";

		}
	}
}
export default WaterVolumeChannelAndIncomeChart;