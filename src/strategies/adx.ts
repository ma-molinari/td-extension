import { 
  transactionItem,
  percentualVariation
} from "../utils/helper";
import {toaster} from "evergreen-ui"

export default class AdxStrategy {
  db:any;
  current: any;
  previous: any;
  symbol: string;
  currentValue: number;
  rsi: number;

  constructor(
    db:any,
    current:any,
    previous:any,
    currentValue:string,
    symbol:string,
    rsi: string
  ){
    this.db = db;
    this.current = current;
    this.previous = previous;
    this.currentValue = parseFloat(currentValue);
    this.symbol = symbol;
    this.rsi = parseFloat(rsi);
  }

  name() {
    return 'ADX_STRATEGY'
  }

  async buy() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolClosed = currentSymbol[currentSymbol?.length - 1]?.status === "close";
    const symbolTypeLong = currentSymbol[currentSymbol?.length - 1]?.type === "long";

    const currentTrend = parseFloat(this.current[0]?.innerText);
    const currentBuy = parseFloat(this.current[1]?.innerText);
    const currentSell = parseFloat(this.current[2]?.innerText);

    const previousTrend = parseFloat(this.previous?.trend);
    const previousBuy = parseFloat(this.previous?.buy);
    const previousSell = parseFloat(this.previous?.sell);

    console.log('percentual buy',percentualVariation(previousBuy,currentBuy));
    console.log('percentual sell',percentualVariation(previousSell,currentSell));

    if(lastSymbolClosed && symbolTypeLong || currentSymbol?.length === 0){
      if(
        currentBuy > currentSell &&
        currentBuy > previousBuy &&
        percentualVariation(previousBuy,currentBuy) >= 15 &&
        currentSell < previousSell &&
        percentualVariation(previousSell,currentSell) <= -15 &&
        this.current[0]?.getAttribute("style")?.includes('color: rgb(255, 255, 255);') &&
        // currentTrend <= 32 &&
        currentTrend < currentBuy &&
        currentTrend > previousTrend &&
        this.rsi >= 20
      ){
        console.log("adx open buy",transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "long",
          status: "open"
        }))
  
        await this.db.add('transactions', transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "long",
          status: "open"
        }));
        toaster.success(`Open Buy ADX - ${this.currentValue}`, {duration: 20})
      }
    }
  }

  async closeBuy() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolValue = currentSymbol[currentSymbol?.length - 1]?.currentValue;
    const lastSymbolOpened = currentSymbol[currentSymbol?.length - 1]?.status === "open";
    const symbolTypeLong = currentSymbol[currentSymbol?.length - 1]?.type === "long";

    const currentTrend = parseFloat(this.current[0]?.innerText);
    const currentBuy = parseFloat(this.current[1]?.innerText);
    const currentSell = parseFloat(this.current[2]?.innerText);

    const previousTrend = parseFloat(this.previous?.trend);
    const previousBuy = parseFloat(this.previous?.buy);
    const previousSell = parseFloat(this.previous?.sell);

    if(lastSymbolOpened && symbolTypeLong){
      if(this.current[0]?.getAttribute("style")?.includes('color: rgb(255, 255, 255);') === false){
        console.log("adx close buy",transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue, 
          rank: 100,
          strategy: this.name(),
          type: "long",
          status: "close"
        }));

        await this.db.add('transactions', transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "long",
          status: "close"
        }));

        toaster.warning(`Close Buy ADX - ${this.currentValue}`, {duration: 20})
      }
    }
  }

  async sell() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolClose = currentSymbol[currentSymbol?.length - 1]?.status === "close";
    const symbolTypeShort = currentSymbol[currentSymbol?.length - 1]?.type === "short";

    const currentTrend = parseFloat(this.current[0]?.innerText);
    const currentBuy = parseFloat(this.current[1]?.innerText);
    const currentSell = parseFloat(this.current[2]?.innerText);

    const previousTrend = parseFloat(this.previous?.trend);
    const previousBuy = parseFloat(this.previous?.buy);
    const previousSell = parseFloat(this.previous?.sell);

    if(lastSymbolClose && symbolTypeShort || currentSymbol?.length === 0){
      if(
        currentSell > currentBuy &&
        currentSell > previousSell &&
        percentualVariation(previousSell,currentSell) >= 15 &&
        currentBuy < previousBuy &&
        percentualVariation(previousBuy,currentBuy) <= -15 &&
        this.current[0]?.getAttribute("style")?.includes('color: rgb(255, 255, 255);') &&
        // currentTrend < 32 &&
        currentTrend < currentSell &&
        currentTrend > previousTrend &&
        this.rsi <= 80
      ){
        console.log("adx open sell",transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "short",
          status: "open"
        }));
  
        await this.db.add('transactions', transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "short",
          status: "open"
        }));

        toaster.success(`Open Sell ADX - ${this.currentValue}`, {duration: 20})
      }
    }
  }

  async closeSell() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolValue = currentSymbol[currentSymbol?.length - 1]?.currentValue;
    const lastSymbolOpened = currentSymbol[currentSymbol?.length - 1]?.status === "open";
    const symbolTypeShort = currentSymbol[currentSymbol?.length - 1]?.type === "short";

    const currentTrend = parseFloat(this.current[0]?.innerText);
    const currentBuy = parseFloat(this.current[1]?.innerText);
    const currentSell = parseFloat(this.current[2]?.innerText);

    const previousTrend = parseFloat(this.previous?.trend);
    const previousBuy = parseFloat(this.previous?.buy);
    const previousSell = parseFloat(this.previous?.sell);

    if(lastSymbolOpened && symbolTypeShort){
      if(this.current[0]?.getAttribute("style")?.includes('color: rgb(255, 255, 255);') === false){
        console.log("adx close sell",
        transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "short",
          status: "close"
        }));
  
        await this.db.add('transactions', transactionItem({
          symbol: this.symbol,
          currentValue: this.currentValue,
          rank: 100,
          strategy: this.name(),
          type: "short",
          status: "close"
        }));

        toaster.warning(`Close Sell ADX - ${this.currentValue}`, {duration: 20})
      }
    }
  }
}