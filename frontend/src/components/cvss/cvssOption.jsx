import React from 'react'
import PropTypes from 'prop-types'

const CVSSOption = ({ cvss, setCvss, name, value, label }) => {
	const handleCVSS = (event) => {
		const split = event.target.id.split('_')

		setCvss((old) => ({
			...old,
			[split[0]]: split[1]
		}))
	}

	return (
		<>
			<input id={`${name}_${value}`} type='radio' name={name} value={value} />
			<div
				id={`${name}_${value}_label`}
				htmlFor={`${name}_${value}`}
				className={'w-2/1 text-xs flex items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-black hover:bg-gray-300 px-1 '.concat(
					cvss[name] === value ? 'text-red-700' : 'text-black'
				)}
				onClick={handleCVSS}
				onKeyDown={handleCVSS}
				role='button'
				tabIndex='0'
			>
				{label} ({value})
			</div>
		</>
	)
}
CVSSOption.propTypes = {
	cvss: PropTypes.objectOf(PropTypes.object).isRequired,
	setCvss: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired
}

export default CVSSOption
