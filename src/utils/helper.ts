import { remove } from "lodash"

export const symbolItemClosed = (symbol,currentValue,adx,didi,rsi) => {
  return {
    symbol,
    currentValue: parseFloat(currentValue),
    adx: {
      trend: adx[0]?.innerText,
      buy: adx[1]?.innerText,
      sell: adx[2]?.innerText,
    },
    didi: {
      sell:didi[0]?.innerText,
      buy: didi[1]?.innerText
    },
    rsi: rsi[0]?.innerText,
  }
}

export const transactionItem = ({symbol,currentValue,type,rank,strategy,status}) => {
  return {
    date: new Date(),
    symbol,
    currentValue,
    type,
    rank,
    strategy,
    status
  }
}

export const getValueRenko = (elements,idx) => {
  return elements && elements[idx]?.getElementsByClassName("valueItem-3JDGGSt_")[4].innerText?.replace("C","");
}

export const getElement = (elements,idx) => {
  return elements && elements[idx]?.getElementsByClassName('valuesAdditionalWrapper-3BfAIuML')[0]?.getElementsByClassName("valueValue-3kA0oJs5");
}

export const getSymbolName = (elements,idx) => {
  return  elements[idx]?.getElementsByClassName('titleWrapper-1Zs2rjQ6')[0]?.getElementsByTagName("div")[0]?.innerText;
}

export const removeFirstItemOnMaxLength = (data,indicators) => {
  if(data?.length === 10){
    remove(
      indicators,
      (e) => e === data[0]
    )
  }
}

export const percentualVariation = (small: number, big: number): number => {
  return 100 - (( small/big ) * 100);
}
