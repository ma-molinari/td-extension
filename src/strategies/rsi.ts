import { 
	transactionItem
} from "../utils/helper";

export default class RsiStrategy {
  db:any;
  current: number;
  previous: number;
  symbol: string;
  currentValue: number;

  constructor(
    db:any,
    current:string,
    previous:string,
    currentValue:string,
    symbol:string,
  ){
    this.db = db;
    this.current = parseFloat(current);
    this.previous = parseFloat(previous);
    this.currentValue = parseFloat(currentValue);
    this.symbol = symbol;
  }

  name() {
    return 'RSI_STRATEGY'
  }

  async buy() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolClosed = currentSymbol[currentSymbol?.length - 1]?.status === "close";
    const symbolTypeLong = currentSymbol[currentSymbol?.length - 1]?.type === "long";

    if(lastSymbolClosed && symbolTypeLong || currentSymbol?.length === 0){
      if(this.current >= 30 && this.current >= this.previous && this.previous <= 30){
        console.log("open buy",transactionItem({
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
      }
    }
  }

  async closeBuy() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolValue = currentSymbol[currentSymbol?.length - 1]?.currentValue;
    const lastSymbolOpened = currentSymbol[currentSymbol?.length - 1]?.status === "open";
    const symbolTypeLong = currentSymbol[currentSymbol?.length - 1]?.type === "long";

    if(lastSymbolOpened && symbolTypeLong){
      if(this.previous >= this.current || lastSymbolValue >= this.currentValue){
        console.log("close buy",transactionItem({
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
      }
    }
  }

  async sell() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolClose = currentSymbol[currentSymbol?.length - 1]?.status === "close";
    const symbolTypeShort = currentSymbol[currentSymbol?.length - 1]?.type === "short";

    if(lastSymbolClose && symbolTypeShort || currentSymbol?.length === 0){
      if(this.current <= 70 && this.current <= this.previous && this.previous >= 70){
        console.log("open sell",transactionItem({
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
      }
    }
  }

  async closeSell() {
    const res = await this.db.getAllFromIndex('transactions', 'date');
    const currentSymbol = res?.filter((item) => item?.symbol === this.symbol);

    const lastSymbolValue = currentSymbol[currentSymbol?.length - 1]?.currentValue;
    const lastSymbolOpened = currentSymbol[currentSymbol?.length - 1]?.status === "open";
    const symbolTypeShort = currentSymbol[currentSymbol?.length - 1]?.type === "short";

    if(lastSymbolOpened && symbolTypeShort){
      if(this.previous <= this.current || lastSymbolValue <= this.currentValue){
        console.log("close sell",
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
      }
    }
  }
}