import React, { useEffect, useState } from 'react'
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

	const handleCVSS = (event) => {
		const split = event.target.id.split('_')
		const atribute = split[0]
		const value = split[1]

		setCvss((old) => ({
			...old,
			[atribute]: value
		}))
	}

	const isSelected = (event) => {
		console.log(`event`, event.target)
		const split = event.target.id.split('_')
		const value = split[1]

		return cvss.AV.toString() === value
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
										<li>
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
										<li>
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

			<div className=''>
				<div className='font-mono text-5xl'>CVSS</div>
				<div className='font-mono py-2 text-1xl'>{cvssVector}</div>

				<div className='font-mono py-2 text-2xl'>Base Score</div>
				<div className='grid gap-8 grid-cols-2'>
					<div id='col-1-base'>
						<div className='flex flex-col'>
							<div className='text-lg'>Attack Vector (AV)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='AV_N' type='radio' name='AV' value='N' />
								<div
									id='AV_N_label'
									htmlFor='AV_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AV === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Network (N)
								</div>

								<input id='AV_A' type='radio' name='AV' value='A' />
								<div
									id='AV_A_label'
									htmlFor='AV_A'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AV === 'A' ? ' text-red-700 ' : ' text-black '
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Adjacent (A)
								</div>

								<input id='AV_L' type='radio' name='AV' value='L' />
								<div
									id='AV_L_label'
									htmlFor='AV_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AV === 'L' ? ' text-red-700 ' : ' text-black '
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Local (L)
								</div>

								<input id='AV_P' type='radio' name='AV' value='P' />
								<div
									id='AV_P_label'
									htmlFor='AV_P'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AV === 'P' ? ' text-red-700 ' : ' text-black '
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Physical (P)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>Attack Complexity (AC)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='AC_L' type='radio' name='AV' value='L' />
								<div
									id='AC_L_label'
									htmlFor='AC_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AC === 'L' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Low (L)
								</div>

								<input id='AC_H' type='radio' name='AV' value='H' />
								<div
									id='AC_H_label'
									htmlFor='AC_H'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.AC === 'H' ? ' text-red-700 ' : ' text-black '
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									High (H)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>Privileges Required (PR)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='PR_N' type='radio' name='AV' value='N' />
								<div
									id='PR_N_label'
									htmlFor='PR_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.PR === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									None (N)
								</div>

								<input id='PR_L' type='radio' name='AV' value='L' />
								<div
									id='PR_L_label'
									htmlFor='PR_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.PR === 'L' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Low (L)
								</div>

								<input id='PR_H' type='radio' name='AV' value='H' />
								<div
									id='PR_H_label'
									htmlFor='PR_H'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.PR === 'H' ? ' text-red-700 ' : ' text-black '
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									High (H)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>User Interaction (UI)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='UI_N' type='radio' name='AV' value='N' />
								<div
									id='UI_N_label'
									htmlFor='UI_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.UI === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									None (N)
								</div>

								<input id='UI_R' type='radio' name='AV' value='R' />
								<div
									id='UI_R_label'
									htmlFor='UI_R'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.UI === 'R' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Required (R)
								</div>
							</div>
						</div>
					</div>

					<div id='col-2-base'>
						<div className='flex flex-col'>
							<div className='text-lg'>Scope (S)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='S_U' type='radio' name='AV' value='U' />
								<div
									id='S_U_label'
									htmlFor='S_U'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.S === 'U' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Unchanged (U)
								</div>

								<input id='S_C' type='radio' name='AV' value='C' />
								<div
									id='S_C_label'
									htmlFor='S_C'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.S === 'C' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Changed (C)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>Confidentiality (C)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='C_N' type='radio' name='AV' value='N' />
								<div
									id='C_N_label'
									htmlFor='C_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.C === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									None (N)
								</div>

								<input id='C_L' type='radio' name='AV' value='L' />
								<div
									id='C_L_label'
									htmlFor='C_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.C === 'L' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Low (L)
								</div>

								<input id='C_H' type='radio' name='AV' value='H' />
								<div
									id='C_H_label'
									htmlFor='C_H'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.C === 'H' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									High (H)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>Integrity (I)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='I_N' type='radio' name='AV' value='N' />
								<div
									id='I_N_label'
									htmlFor='I_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.I === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									None (N)
								</div>

								<input id='I_L' type='radio' name='AV' value='L' />
								<div
									id='I_L_label'
									htmlFor='I_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.I === 'L' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Low (L)
								</div>

								<input id='I_H' type='radio' name='AV' value='H' />
								<div
									id='I_H_label'
									htmlFor='I_H'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.I === 'H' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									High (H)
								</div>
							</div>
						</div>

						<div className='flex flex-col'>
							<div className='text-lg'>Availability (A)</div>

							<div className='flex gap-2 flex-row text-sm'>
								<input id='A_N' type='radio' name='AV' value='N' />
								<div
									id='A_N_label'
									htmlFor='A_N'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.A === 'N' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									None (N)
								</div>

								<input id='A_L' type='radio' name='AV' value='L' />
								<div
									id='A_L_label'
									htmlFor='A_L'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.A === 'L' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									Low (L)
								</div>

								<input id='A_H' type='radio' name='AV' value='H' />
								<div
									id='A_H_label'
									htmlFor='A_H'
									className={'w-2/1 flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 '.concat(
										cvss.A === 'H' ? 'text-red-700' : 'text-black'
									)}
									onClick={handleCVSS}
									onKeyDown={handleCVSS}
									role='button'
									tabIndex='0'
								>
									High (H)
								</div>
							</div>
						</div>
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
