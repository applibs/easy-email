import { ajax, AjaxResponse } from "rxjs/ajax";
import { map, filter, switchMap, debounceTime } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import {useState} from "react";
import {IProduct} from "@demo/pages/Editor/components/CustomBlocks/Products/generateProductBlock";

import testdata from './response.json';
//let testdata = require('response.json');

export interface Suggestion {
    id: number;
    title: string;
    price: number;
    currency: string;
    image: string;
    url: string;
}

// use alphavantage API instead of respone.json to see real results
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${YOUR_API_KEI}`
const getApiUrl = (value: string) => `response.json?value=${value}`;


const transformResponse = ({ response }: AjaxResponse) => {
    console.log("transformResponse");
    return response.data.map(item => ({
        id: item["id"],
        title: item["title"],
        price: item["price"],
        currency: item["currency"],
        image: item["image"],
        url: item["url"],
    }));
};

export const getSuggestions = <S>(
    subject: BehaviorSubject<string>
): Observable<S[]> => {
    console.log("getSuggestions");

    return subject.pipe(
        debounceTime(500),
        filter(v => v.length > 2),
        map(getApiUrl),
        switchMap(url => ajax(url)),
        map(transformResponse)
    );
};

const getData = (searchTerm) => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("https://dummyjson.com/products/search?q=" + searchTerm, {
        signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(
                "search term: " + searchTerm + ", results: ",
                myJson.products
            );
            const updatedOptions = myJson.products.map((p) => {
                return { title: p.title };
            });
            //setOptions(updatedOptions);
        });
};