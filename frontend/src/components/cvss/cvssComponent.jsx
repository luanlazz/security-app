import React from 'react'
import PropTypes from 'prop-types'

const CVSSComponent = ({ label, children }) => {
	return (
		<>
			<div className='flex flex-col'>
				<div className='text-lg'>{label}</div>

				<div className='flex gap-2 flex-row flex-wrap text-sm '>{children}</div>
			</div>
		</>
	)
}
CVSSComponent.propTypes = {
	label: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
}

export default CVSSComponent
