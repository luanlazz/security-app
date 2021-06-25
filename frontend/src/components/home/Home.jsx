import React, { useEffect, useState } from 'react'
import { CVSSOption, CVSSComponent } from '../cvss'
import api from '../../services/api'

import './style.scss'

const Home = () => {
	const [form, setForm] = useState({})
	const [cveData, setCveData] = useState({})
	const [fetching, setFetching] = useState(false)
	const [cvssData, setCvssData] = useState({
		base: { score: 0, rating: 'none' },
		environmental: { score: 0, rating: 'none' },
		temporal: { score: 0, rating: 'none' }
	})
	const [fetchingCVSS, setFetchingCVSS] = useState(false)
	const [cvssForm, setCvssForm] = useState({})
	const [cvssVector, setCvssVector] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const vector = `CVSS:3.0${Object.keys(cvssForm)
			.reduce((accumulator, key) => {
				return cvssForm[key] ? `${accumulator}/${key}:${cvssForm[key]}` : accumulator
			}, '')
			.toUpperCase()}`

		const fetchingCVSSData = async () => {
			try {
				setFetchingCVSS(true)
				const res = await api.post(`/cvss`, {
					vector: cvssVector
				})
				setFetchingCVSS(false)

				setCvssData(res.data)
			} catch (error) {
				setFetchingCVSS(false)
			}
		}

		if (!fetchingCVSS) fetchingCVSSData()
		setCvssVector(vector)
	}, [cvssForm])

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
			setCvssForm({})
			const res = await api.get(`/cve/${form.cve}`)
			setFetching(false)

			setCveData(res.data)

			res.data.cvssVector
				.toString()
				.split('/')
				.forEach((element) => {
					const split = element.split(':')
					setCvssForm((old) => ({ ...old, [split[0]]: split[1] }))
				})
		} catch (error) {
			setErrorMessage(error.response.data.error)
			setFetching(false)
		}
	}

	const getColorRating = (rating) => {
		switch (rating) {
			case 'Low':
				return 'yellow-400'

			case 'Medium':
				return 'yellow-700'

			case 'High':
				return 'red-600'

			case 'Critical':
				return 'purple-700'

			default:
				return 'white'
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
				<div className='grid gap-4 grid-cols-3 m-4 justify-items-center'>
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

						<div className='grid grid-cols-2 text-xs break-all'>
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

			<div className='flex flex-col m-4 p-2 justify-center'>
				<div className='font-mono mt-6 text-5xl text-center'>CVSS</div>
				<div className='font-mono mx-4 my-2 p-1 text-1xl bg-white rounded-md text-black break-all'>{cvssVector}</div>

				<div className='flex flex-row align-center items-center'>
					<div className='font-mono my-2 text-2xl'>Base Score</div>
					<div id='score-base' className='flex flex-row font-mono mx-6 items-center	'>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.base.rating)}`)}>{cvssData.base.score}</div>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.base.rating)}`)}>{cvssData.base.rating}</div>
					</div>
				</div>
				<div className='grid gap-8 grid-cols-2 '>
					<div id='col-1-base'>
						<CVSSComponent label='Attack Vector (AV)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AV' value='N' label='Network' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AV' value='A' label='Adjacent' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AV' value='L' label='Local' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AV' value='P' label='Physical' />
						</CVSSComponent>

						<CVSSComponent label='Attack Complexity (AC)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AC' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AC' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Privileges Required (PR)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='PR' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='PR' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='PR' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='User Interaction (UI)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='UI' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='UI' value='R' label='Required' />
						</CVSSComponent>
					</div>

					<div id='col-2-base'>
						<CVSSComponent label='Scope (S)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='S' value='U' label='Unchanged' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='S' value='C' label='Changed' />
						</CVSSComponent>

						<CVSSComponent label='Confidentiality (C)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='C' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='C' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='C' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Integrity (I)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='I' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='I' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='I' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Availability (A)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='A' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='A' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='A' value='H' label='High' />
						</CVSSComponent>
					</div>
				</div>

				<div className='flex flex-row align-center items-center'>
					<div className='font-mono my-2 text-2xl'>Temporal Score</div>
					<div id='score-base' className='flex flex-row font-mono mx-6 items-center	'>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.temporal.rating)}`)}>
							{cvssData.temporal.score}
						</div>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.temporal.rating)}`)}>
							{cvssData.temporal.rating}
						</div>
					</div>
				</div>
				<div className='grid gap-8 grid-cols-2'>
					<div id='col-1-base'>
						<CVSSComponent label='Exploit Code Maturity (E)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='E' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='E' value='U' label='Unproven' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='E' value='P' label='Proof-of-concept' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='E' value='F' label='Functional' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='E' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Remediation Level (RL)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RL' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RL' value='O' label='Official Fix' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RL' value='T' label='Temporary Fix' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RL' value='W' label='Workaround' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RL' value='U' label='Unavailable' />
						</CVSSComponent>
					</div>

					<div id='col-2-base'>
						<CVSSComponent label='Report Confidence (RC)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RC' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RC' value='U' label='Unknown' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RC' value='R' label='Reasonable' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='RC' value='C' label='Confirmed' />
						</CVSSComponent>
					</div>
				</div>

				<div className='flex flex-row align-center items-center'>
					<div className='font-mono my-2 text-2xl'>Environmental Score</div>
					<div id='score-base' className='flex flex-row font-mono mx-6 items-center	'>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.environmental.rating)}`)}>
							{cvssData.environmental.score}
						</div>
						<div className={'p-2'.concat(` text-${getColorRating(cvssData.environmental.rating)}`)}>
							{cvssData.environmental.rating}
						</div>
					</div>
				</div>
				<div className='grid gap-8 grid-cols-2'>
					<div id='col-1-base'>
						<CVSSComponent label='Confidentiality Requirement (CR)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='CR' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='CR' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='CR' value='M' label='Medium' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='CR' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Integrity Requirement (IR)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='IR' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='IR' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='IR' value='M' label='Medium' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='IR' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Availability Requirement (AR)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AR' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AR' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AR' value='M' label='Medium' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='AR' value='H' label='High' />
						</CVSSComponent>
					</div>

					<div id='col-2-base'>
						<CVSSComponent label='Modified Attack Vector (MAV)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAV' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAV' value='N' label='Network' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAV' value='A' label='Adjacent Network' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAV' value='L' label='Local' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAV' value='P' label='Physical' />
						</CVSSComponent>

						<CVSSComponent label='Modified Attack Complexity (MAC)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAC' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAC' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MAC' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Modified Privileges Required (MPR)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MPR' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MPR' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MPR' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MPR' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Modified User Interaction (MUI)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MUI' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MUI' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MUI' value='R' label='Required' />
						</CVSSComponent>

						<CVSSComponent label='Modified Scope (MS)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MS' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MS' value='U' label='Unchanged' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MS' value='C' label='Changed' />
						</CVSSComponent>

						<CVSSComponent label='Modified Confidentiality (MC)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MC' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MC' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MC' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MC' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Modified Integrity (MI)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MI' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MI' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MI' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MI' value='H' label='High' />
						</CVSSComponent>

						<CVSSComponent label='Modified Availability (MA)'>
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MA' value='X' label='Not Defined' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MA' value='N' label='None' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MA' value='L' label='Low' />
							<CVSSOption cvss={cvssForm} setCvss={setCvssForm} name='MA' value='H' label='High' />
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
