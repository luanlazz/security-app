import React, { useState } from 'react'
import api from '../../services/api'

import './style.scss'

const Home = () => {
	const [form, setForm] = useState({})
	const [fetching, setFetching] = useState(false)
	const [cveData, setCveData] = useState({})
	const [errorMessage, setErrorMessage] = useState('')

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
				<div className='flex flex-col p-10'>
					<div className='font-mono py-2 text-2xl'>
						{cveData.id} ({cveData.cwe})
					</div>
					<div>resumo: {cveData.summary}</div>

					<div className='font-mono py-2 text-2xl'>Impacto</div>

					<div>Disponibilidade: {cveData.impact.availability}</div>
					<div>Confidencialidade: {cveData.impact.confidentiality}</div>
					<div>Integridade: {cveData.impact.integrity}</div>

					<div className='font-mono py-2 text-2xl'>Referencias</div>

					<ul className='flex flex-col list-disc pl-10'>
						{cveData.references.map((link) => {
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
			)}

			{errorMessage && (
				<div className=''>
					{errorMessage || 'Ocorreu um erro ao realizar a pesquisa, por favor tente novamente mais tarde'}
				</div>
			)}
		</div>
	)
}

export default Home
