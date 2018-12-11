import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight,
	Modal,
	FlatList
} from 'react-native';
import packageJson from '../../package.json';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CustomerActions from "../actions/CustomerActions";
import * as ToolBarActions from "../actions/ToolBarActions";
import Communications from "../services/Communications";
import PosStorage from "../database/PosStorage";
import * as SettingsActions from "../actions/SettingsActions";
import DatePicker from 'react-native-datepicker';
import Events from "react-native-simple-events";

import i18n from '../app/i18n';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			datetime: null,
			selectedSamplingSite: null
		};

		if (this.props.waterOpConfigs.samplingSites) {
			this.setState({
				selectedSamplingSite: this.props.waterOpConfigs.samplingSites[0]
			});
		}

		this.getParametersForm = this.getParametersForm.bind(this);
		this.closeWaterOpsModal = this.closeWaterOpsModal.bind(this);
		this.onShowWaterQualityAndFlowmeter = this.onShowWaterQualityAndFlowmeter.bind(this);
	}

	render() {
		return (
			<View style={styles.toolbar}>
				<View style={[styles.leftToolbar]}>
					<Image source={require('../images/swe-logo.png')} resizeMode='stretch' style={styles.logoSize} />
					<TouchableHighlight onPress={() => this.onVersion()}>
						<Text style={[styles.text_style, { marginLeft: 50 }]}>{i18n.t('version')} {packageJson.version}</Text>
					</TouchableHighlight>
					<Text style={[styles.text_style, { marginLeft: 20 }, this.getNetworkStyle()]}>{this.getNetworkState()}</Text>
					<Text style={[styles.text_style, { marginLeft: 30 }]}>{i18n.t('site')}:</Text>
					<View style={[styles.site_container, { marginLeft: 20 }]}>
						<Text style={styles.site_text}>{this.props.settings.site}</Text>
					</View>
				</View>
				<View style={[styles.rightToolbar]}>
					<TouchableHighlight onPress={() => this.onSettings()}>
						<Image source={require('../images/gear-icon.png')} resizeMode='stretch' style={[styles.iconSize, { marginRight: 20 }]} />
					</TouchableHighlight>
					{this.getLogoutUI()}
					<Text style={[styles.text_style, { marginRight: 20 }]}>{this.props.settings.user}</Text>
					<TouchableHighlight onPress={() => this.onShowRemoteReport()}>
						{this.getReportOrMainImage()}
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.onShowWaterQualityAndFlowmeter()}>
						<Image source={require('../images/water-quality-and-flowmeter.png')} style={[styles.iconSize, { marginRight: 15 }]} />
					</TouchableHighlight>
				</View>
				<Modal visible={this.state.isVisible}
					transparent={false}
					onRequestClose={() => this.closeWaterOpsModal()}>
					<View style={styles.modal_container}>
						<View style={styles.modal_toolbar}>
							<DatePicker
								style={styles.date_picker}
								date={this.state.datetime}
								mode="datetime"
								format="YYYY-MM-DD HH:mm"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								iconSource={require('../images/calendar-icon.png')}
								onDateChange={(datetime) => { this.setState({ datetime: datetime }); }}
							/>
						</View>

						<View style={styles.modal_content_container}>
							<View style={styles.modal_sidebar}>
								{this.props.waterOpConfigs.samplingSites ?
									<FlatList
										ref={(ref) => { this.flatListRef = ref; }}
										data={this.props.waterOpConfigs.samplingSites}
										extraData={this.state}
										renderItem={({ item, index, separators }) => (
											<TouchableHighlight
												onPress={() => this.onPressItem(item)}
												onShowUnderlay={separators.highlight}
												onHideUnderlay={separators.unhighlight}>
												{this.getRow(item, index, separators)}
											</TouchableHighlight>
										)}
										keyExtractor={item => String(item.id)}
									/>
									:
									<View style={[
										styles.selectedSamplingSiteRow,
										{
											flexDirection: 'row',
											height:50,
											alignItems:'center',
											justifyContent: 'center'
										}
									]}>
										<Text>Loading sampling sites...</Text>
									</View>
								}
							</View>

							{/* {this.state.selectedSamplingSite ?

								:
								null
							} */}
							<View style={styles.modal_content}>
								{this.getParametersForm()}
								<Text>
									{/* TODO 1: Display list of parameter names for the selected sampling site */}
									{/* TODO 2: Display list of parameters for the selected sampling site as a form of inputs */}
									There will be a form here with the parameters for the selected sampling site
								</Text>
							</View>
						</View>

						<View style={styles.modal_footer}>
							<View style={styles.modal_button_container}>
								<TouchableHighlight
								style={[styles.modal_cancel_button, styles.modal_button]}
								onPress={() => this.closeWaterOpsModal()}>
									<Text style={styles.modal_cancel_button_text}>Cancel</Text>
								</TouchableHighlight>

								<TouchableHighlight
								style={[styles.modal_submit_button, styles.modal_button]}
								onPress={() => this.onSubmitParameters()}>
									<Text style={styles.modal_submit_button_text}>Submit</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	};

	getParametersForm() {
		if (this.state.selectedSamplingSite) {
			// TODO: Filter the mappings for the current sampling site first
			const params = this.props.waterOpConfigs.idMapping.map((mapping, idx) => {
				if (this.state.selectedSamplingSite.id !== mapping.sampling_site_id) return;
	
				const currentParameter = this.props.waterOpConfigs.parameters.reduce((curr, next) => {
					if (next.id === mapping.parameter_id) return next;
				}, null);
	
				if (!currentParameter) return;
	
				return (<Text key={idx}>{currentParameter.name}</Text>);
			});

			console.log(params);
	
			return params;
		}
		return null;
	}

	getRowStyles(isSelected) {
		if(isSelected) {
			return styles.selectedSamplingSiteRow;
		} else {
			return styles.samplingSiteRow;
		}
	}

	// TODO 3: Send the parameters of the selected sampling site to the server
	onSubmitParameters() {
		console.log('lol');
	}

	getRowTextStyles(isSelected) {
		if(isSelected) {
			return styles.selectedSamplingSiteText;
		} else {
			return styles.samplingSiteText;
		}
	}

	getRow(item, index) {
		let selectedSamplingSite = this.state.selectedSamplingSite ||
			this.props.waterOpConfigs.samplingSites[0];
		return (
			<View style={[
				this.getRowStyles(selectedSamplingSite.id === item.id),
				{
					flex: 1,
					flexDirection: 'row',
					height:50,
					alignItems:'center'
				}
			]}>
				<Text style={[
					this.getRowTextStyles(selectedSamplingSite.id === item.id),
					styles.baseItem,
					styles.leftMargin
				]}>{item.name}</Text>
			</View>
		);
	}

	onPressItem(item) {
		console.log("_onPressItemSamplingSitesList");
		this.setState({
			selectedSamplingSite: item
		});
	}

	onShowWaterQualityAndFlowmeter() {
		this.setState({
			isVisible: true,
			datetime: new Date(Date.now())
		});
	}

	closeWaterOpsModal() {
		console.log('CLOSING WaterOps modal');
		this.setState({
			isVisible: false
		});
	}

	getLogoutUI() {
		if (this.props.showScreen.screenToShow !== "settings") {
			return (
				<TouchableHighlight onPress={() => this.onLogout()}>
					<Text style={[styles.text_style, { marginRight: 20 }]}>{i18n.t('logout')}</Text>
				</TouchableHighlight>

			)
		} else {
			return null;
		}
	};

	getNetworkState = () => {
		return this.props.network.isNWConnected ? i18n.t('online') : i18n.t('offline');
	};
	getNetworkStyle = () => {
		return this.props.network.isNWConnected ? {} : { color: 'red' };
	};
	getReportOrMainImage = () => {
		if (this.props.showScreen.screenToShow === "main") {
			return (
				<Image source={require('../images/report-icon.png')} resizeMode='stretch' style={[styles.iconSize, { marginRight: 20 }]} />

			)
		} else {
			return (
				<Image source={require('../images/home-icon.png')} resizeMode='stretch' style={[styles.iconSize, { marginRight: 20 }]} />
			)
		}
	};
	onShowRemoteReport = () => {
		console.log("onShowRemoteReport");
		if (this.props.showScreen.screenToShow !== "settings") {
			if (this.props.showScreen.screenToShow === "main") {
				this.props.toolbarActions.ShowScreen("report");
			} else {
				this.props.toolbarActions.ShowScreen("main");
			}
		}
	};

	onVersion = () => {
		console.log("onVersion");
		Communications.getCustomers()
			.then(customers => {
				console.log("CUSTOMERS -" + JSON.stringify(customers));
			});

	};

	onLogout = () => {
		console.log("onLogout");
		this.props.toolbarActions.SetLoggedIn(false);
		let settings = PosStorage.getSettings();

		// Save with empty token - This will force username/password validation
		PosStorage.saveSettings(settings.semaUrl, settings.site, settings.user, settings.password, settings.uiLanguage, "", settings.siteId);
		this.props.settingsActions.setSettings(PosStorage.getSettings());
		Communications.setToken("");

	};

	onSettings = () => {
		console.log("onSettings");
		if (this.props.showScreen.screenToShow !== "settings") {
			this.props.toolbarActions.ShowScreen("settings");
		}
	};
}

function mapStateToProps(state, props) {
	return {
		network: state.networkReducer.network,
		showScreen: state.toolBarReducer.showScreen,
		settings: state.settingsReducer.settings,
		waterOpConfigs: state.waterOpsReducer.configs
	};
}


function mapDispatchToProps(dispatch) {
	return {
		customerActions: bindActionCreators(CustomerActions, dispatch),
		settingsActions: bindActionCreators(SettingsActions, dispatch),
		toolbarActions: bindActionCreators(ToolBarActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

const styles = StyleSheet.create({
	samplingSiteRow:{
		opacity: .8,
		backgroundColor: '#2858a7'
	},

	selectedSamplingSiteRow:{
		backgroundColor: '#fff'
	},

	samplingSiteText:{
		color: '#fff'
	},

	selectedSamplingSiteText:{
	},

	baseItem:{
		fontSize:18
	},

	leftMargin:{
		left:10
	},

	toolbar: {
		backgroundColor: '#2858a7',
		height: 56,
		flexDirection: 'row'
	},

	leftToolbar: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'

	},
	rightToolbar: {
		flexDirection: 'row-reverse',
		flex: 1,
		alignItems: 'center'

	},

	toolbar_old: {
		backgroundColor: '#2858a7',
		height: 56,
		alignSelf: 'stretch',

	},
	text_style: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	},
	logoSize: {
		width: 50,
		height: 50,
		left: 20
	},
	iconSize: {
		width: 40,
		height: 40,
		// right:20
	},

	modal_container: {
		flex: 1,
		flexDirection: 'column',
	},

	date_picker: {
		width: 600,
		backgroundColor: '#fff'
	},

	modal_toolbar: {
		backgroundColor: '#2858a7',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: 56
	},

	modal_sidebar: {
		backgroundColor: '#2858a7',
		flex: 1,
		alignSelf: 'stretch'
	},

	modal_content_container: {
		flex: 1,
		flexDirection: 'row'
	},

	modal_content: {
		flex: 2
	},

	modal_footer: {
		backgroundColor: '#2858a7',
		alignItems: 'flex-end',
		justifyContent: 'center',
		height: 56
	},

	modal_button_container: {
		flexDirection: 'row',
		height: 40,
		width: 250,
		justifyContent: 'space-around'
	},

	modal_cancel_button_text: {
			fontSize: 20
	},

	modal_submit_button_text: {
		fontSize: 20,
		color: '#fff'
	},

	modal_button: {
		width: 120,
		alignItems: 'center',
		justifyContent: 'center'
	},

	modal_cancel_button: {
		backgroundColor: '#fff'
	},

	modal_submit_button: {
		backgroundColor: '#40d20c'
	},

	site_container: {
		backgroundColor: '#E0E0E0',
		// width:200,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 5
	},
	site_text: {
		fontSize: 18,
		fontWeight: 'bold'

	}


});
