import { useEffect, useState } from "react"
import axios from "axios"

import { Col, Container, Row, Text } from "@nextui-org/react"
import { Autocomplete } from "."

import { Country } from "../../ts/interfaces/Country.interface"

import classes from "./ui.module.css"
import React from "react"

const AutocompleteWrapper = () => {
	const [data, setData] = useState<Country[]>([])

	useEffect(() => {
		//axios.get(`https://restcountries.com/v3.1/lang/eng`).then(resp => setData(resp.data))
	}, [])

	return (
		<Autocomplete data={data} />
	)
}

export default AutocompleteWrapper
