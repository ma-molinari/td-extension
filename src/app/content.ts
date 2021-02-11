import { openDB } from 'idb';
import RsiStrategy from "../strategies/rsi"
import AdxStrategy from "../strategies/adx"
import { 
	symbolItemClosed, 
	getElement, 
	getSymbolName, 
	getValueRenko, 
	removeFirstItemOnMaxLength
} from "../utils/helper";

chrome.runtime.sendMessage({}, async (response) => {

	if(window?.location?.pathname === "/chart/wtJ3oHRy/"){
		console.log("logged")
		let indicators = [];
	
		const db = await openDB('renkobot', 1, {
			async upgrade(db) {
				let store = db.createObjectStore('transactions', {
					keyPath: 'id',
					autoIncrement: true,
				});
				store.createIndex('date', 'date');
			}
		});
	
		const verifyIfValuesAreDifferent = (obj, obj2, listSymbols, indicators) => {
			if(JSON.stringify(obj?.adx) !== JSON.stringify(obj2?.adx) || JSON.stringify(obj?.rsi) !== JSON.stringify(obj2?.rsi)){
				removeFirstItemOnMaxLength(listSymbols,indicators);
				indicators.push(obj2);
			}
		}
	
		let ready = setInterval(() => {
			const chartElements = document.getElementsByTagName("tr");
			const symbolNameLeft = getSymbolName(chartElements,0);
			const symbolNameRight = getSymbolName(chartElements,11);
	
			const allSymbolDataLeft = indicators?.filter((item => item?.symbol === symbolNameLeft));
			const allSymbolDataRight = indicators?.filter((item => item?.symbol === symbolNameRight));
			
			//LEFT
			const currentValueLeft = getValueRenko(chartElements,0);
			const adxLeft = getElement(chartElements,2);
			const didiLeft = getElement(chartElements,4);
			const currentRsiLeft = getElement(chartElements,6);
			const previousRsiLeft = allSymbolDataLeft[allSymbolDataLeft?.length - 2]?.rsi;
	
			//RIGHT
			const currentValueRight = getValueRenko(chartElements,11);
			const adxRight = getElement(chartElements,13);
			const didiRight = getElement(chartElements,15);
			const currentRsiRight = getElement(chartElements,17);
			const previousRsiRight = allSymbolDataRight[allSymbolDataRight?.length - 2]?.rsi;

			const strategyAdxLeft = new AdxStrategy(
				db,
				adxLeft,
				allSymbolDataLeft[allSymbolDataLeft?.length - 2]?.adx,
				currentValueLeft,
				symbolNameLeft,
				currentRsiLeft[0]?.innerText
			);
		
			// const strategyRsiRight = new RsiStrategy(
			// 	db,
			// 	currentRsiRight[0]?.innerText,
			// 	previousRsiRight,
			// 	currentValueRight,
			// 	symbolNameRight,
			// );
	
			// const strategyRsiLeft = new RsiStrategy(
			// 	db,
			// 	currentRsiLeft[0]?.innerText,
			// 	previousRsiLeft,
			// 	currentValueLeft,
			// 	symbolNameLeft,
			// );
		
			// const strategyRsiRight = new RsiStrategy(
			// 	db,
			// 	currentRsiRight[0]?.innerText,
			// 	previousRsiRight,
			// 	currentValueRight,
			// 	symbolNameRight,
			// );
		
			if(
				allSymbolDataLeft?.length >= 2 &&
				JSON.stringify(
					allSymbolDataLeft[allSymbolDataLeft?.length - 1]?.adx) !== 
					JSON.stringify(symbolItemClosed(symbolNameLeft,currentValueLeft,adxLeft,didiLeft,currentRsiLeft)?.adx
				)
			){
				// console.log("left");
				// strategyRsiLeft.buy();
				// strategyRsiLeft.closeBuy();
				// strategyRsiLeft.sell();
				// strategyRsiLeft.closeSell();
				// console.log("adx left");
				strategyAdxLeft.buy();
				strategyAdxLeft.closeBuy();
				strategyAdxLeft.sell();
				strategyAdxLeft.closeSell();
			}
	
			// if(
			// 	allSymbolDataRight?.length >= 2 &&
			// 	JSON.stringify(
			// 		allSymbolDataRight[allSymbolDataRight?.length - 1]?.adx) !== 
			// 		JSON.stringify(symbolItemClosed(symbolNameRight,currentValueRight,adxRight,didiRight,currentRsiRight)?.adx
			// 	)
			// ){
			// 	console.log("right");
			// 	strategyRsiRight.buy();
			// 	strategyRsiRight.closeBuy();
			// 	strategyRsiRight.sell();
			// 	strategyRsiRight.closeSell();
			// }

			//populate array
			if(indicators?.length > 0){
				verifyIfValuesAreDifferent(
					allSymbolDataLeft[allSymbolDataLeft?.length - 1],
					symbolItemClosed(symbolNameLeft,currentValueLeft,adxLeft,didiLeft,currentRsiLeft),
					allSymbolDataLeft,
					indicators
				)
				verifyIfValuesAreDifferent(
					allSymbolDataRight[allSymbolDataRight?.length - 1],
					symbolItemClosed(symbolNameRight,currentValueRight,adxRight,didiRight,currentRsiRight),
					allSymbolDataRight,
					indicators
				)
			}else{
				if(
					adxLeft[0]?.innerText !== 'n/a' && 
					adxRight[0]?.innerText !== 'n/a'
				){
					indicators.push(
						symbolItemClosed(symbolNameLeft,currentValueLeft,adxLeft,didiLeft,currentRsiLeft),
						symbolItemClosed(symbolNameRight,currentValueRight,adxRight,didiRight,currentRsiRight)			
					)
				}
			}
		},5000);
	}
	
	// clearInterval(ready);
})

//symbol,value,long or short,rank,strategy,current renko, date