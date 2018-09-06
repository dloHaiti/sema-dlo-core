
import MockStorage from './MockStorage';

const storageCache = {};
let AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);
const PosStorage = require( '../database/PosStorage');

test('Test inventory storage', () => {
	const posStorage = PosStorage.default;
	return posStorage.initialize( true )
		.then( isInitialized =>{
			let inventory1 = {name1:"value1", name2:"value2" };
			expect(posStorage.getInventoryKeys().length).toBe(0);
			posStorage.addOrUpdateInventoryItem(inventory1, new Date("September 6, 2018"));
			expect(posStorage.getInventoryKeys().length).toBe(1);
			return posStorage.initialize( false )
				.then( isInitialized =>{
					expect(posStorage.getInventoryKeys().length).toBe(1);
					inventory1.name1 = "value3";
					// Same date should just update
					posStorage.addOrUpdateInventoryItem(inventory1, new Date("September 6, 2018"));
					expect(posStorage.getInventoryKeys().length).toBe(1);
					return posStorage.initialize( false )
						.then( isInitialized => {
							expect(posStorage.getInventoryKeys().length).toBe(1);
							// New Date should add
							posStorage.addOrUpdateInventoryItem(inventory1, new Date("September 5, 2018"));
							expect(posStorage.getInventoryKeys().length).toBe(2);

							console.log(JSON.stringify(storageCache));
						});
				});

		});
});

