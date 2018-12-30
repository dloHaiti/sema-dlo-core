/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('device', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		serial_number: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		ip_address: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		firmware: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		kiosk_id: {
			type: DataTypes.BIGINT,
			allowNull: false
		}
	}, {
		tableName: 'device',
		timestamps: false,
		underscored: true
	});
};
