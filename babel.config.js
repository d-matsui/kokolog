module.exports = function(api) {
	api.cache(true);
	return {
		presets: [
			'babel-preset-expo',
			'@babel/preset-typescript',
		],
		plugins: [
			// Automatically import React when JSX is used
			['@babel/plugin-transform-react-jsx', {
				runtime: 'automatic'
			}]
		],
	};
};