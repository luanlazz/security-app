import React, { useEffect, useState } from 'react'
import { CVSSOption, CVSSComponent } from '../cvss'
import api from '../../services/api'

import './style.scss'

const Home = () => {
	const [form, setForm] = useState({})
	const [fetching, setFetching] = useState(false)
	const [cveData, setCveData] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	const [cvss, setCvss] = useState({})
	const [cvssVector, setCvssVector] = useState('')

	useEffect(() => {
		const vector = `CVSS:3.0${Object.keys(cvss)
			.reduce((accumulator, key) => {
				return cvss[key] ? `${accumulator}/${key}:${cvss[key]}` : accumulator
			}, '')
			.toUpperCase()}`

		setCvssVector(vector)
	}, [cvss])

	const handleChange = (event) => {
		const { name, value } = event.target
		setForm((old) => ({
			...old,
			[name]: value
		}))
	}

	const getCveData = async (e) => {
		e.preventDefault()
		if (fetching) return

		try {
			setFetching(true)
			setErrorMessage('')
			const res = await api.get(`/cve/${form.cve}`)
			setFetching(false)

			setCveData(res.data)

			res.data.cvssVector
				.toString()
				.split('/')
				.forEach((element) => {
					const split = element.split(':')
					setCvss((old) => ({ ...old, [split[0]]: split[1] }))
				})
		} catch (error) {
			setErrorMessage(error.response.data.error)
			setFetching(false)
		}
	}

	return (
		<div className='flex flex-col text-white justify-center items-center select-none min-h-screen bg-gradient-to-br from-gray-900  to-blue-700'>
			<form className='flex flex-row flex-nowrap space-x-4' onSubmit={getCveData}>
				<div className='font-mono text-5xl flex-1 whitespace-nowrap'>Digite a CVE</div>

				<input className='flex-grow text-black' type='text' name='cve' value={form.cve} onChange={handleChange} />

				<button
					className='w-1/2 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300'
					type='submit'
					disabled={fetching || !form.cve}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
					Pesquisar
				</button>
			</form>

			{fetching && <h2>Carregando...</h2>}
			{Object.keys(cveData).length > 0 && (
				<div className='grid gap-4 grid-cols-3 justify-items-center'>
					<div>
						<div className='font-mono py-2 text-2xl'>
							{cveData.id} ({cveData.cwe})
						</div>
						<div>{cveData.summary}</div>

						<div className='font-mono py-2 text-2xl'>Impacto</div>

						<div>Disponibilidade: {cveData.impact.availability}</div>
						<div>Confidencialidade: {cveData.impact.confidentiality}</div>
						<div>Integridade: {cveData.impact.integrity}</div>
					</div>

					<div className='flex flex-col col-span-2'>
						<div className='font-mono py-2 text-2xl'>Referencias</div>

						<div className='grid grid-cols-2 text-xs'>
							<ul className='flex flex-col list-disc pl-10'>
								{cveData.references.slice(0, cveData.references.length / 2 + 1).map((link) => {
									return (
										<li key={`item-${link}`}>
											<a href={link} target='_blank' rel='noreferrer'>
												{link}
											</a>
										</li>
									)
								})}
							</ul>
							<ul className='flex flex-col list-disc pl-10'>
								{cveData.references.slice(cveData.references.length / 2 + 1).map((link) => {
									return (
										<li key={`item-${link}`}>
											<a href={link} target='_blank' rel='noreferrer'>
												{link}
											</a>
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</div>
			)}

			<div className='flex flex-col'>
				<div className='font-mono text-3xl'>CVSS</div>
				<div className='font-mono py-2 text-1xl bg-white rounded-md text-black'>{cvssVector}</div>

				<div className='font-mono py-2 text-2xl'>Base Score</div>
				<div className='grid gap-8 grid-cols-2'>
					<div id='col-1-base'>
						<CVSSComponent label='Attack Vector (AV)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AV' value='N' label='Network' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AV' value='A' label='Adjacent' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AV' value='L' label='Local' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AV' value='P' label='Physical' />
						</CVSSComponent>

						<CVSSComponent label='Attack Complexity (AC)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AC' value='L' label='Low' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='AC' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Privileges Required (PR)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='PR' value='N' label='None' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='PR' value='L' label='Low' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='PR' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='User Interaction (UI)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='UI' value='N' label='None' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='UI' value='R' label='Required' />
						</CVSSComponent>
					</div>

					<div id='col-2-base'>
						<CVSSComponent label='Scope (S)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='S' value='U' label='Unchanged' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='S' value='C' label='Changed' />
						</CVSSComponent>

						<CVSSComponent label='Confidentiality (C)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='C' value='N' label='None' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='C' value='L' label='Low' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='C' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Integrity (I)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='I' value='N' label='None' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='I' value='L' label='Low' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='I' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Availability (A)'>
							<CVSSOption cvss={cvss} setCvss={setCvss} name='A' value='N' label='None' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='A' value='L' label='Low' />
							<CVSSOption cvss={cvss} setCvss={setCvss} name='A' value='H' label='High' />
						</CVSSComponent>
					</div>
				</div>
			</div>

			{errorMessage && (
				<div className=''>
					{errorMessage || 'Ocorreu um erro ao realizar a pesquisa, por favor tente novamente mais tarde'}
				</div>
			)}
		</div>
	)
}

export default Home
