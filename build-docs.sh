#! bash
cd lib
jsdoc2md \
	--configure ../jsdoc-config.json \
	--files "." \
	--no-cache \
	--separators \
	--example-lang js \
	--partial ../scope.hbs \
	--partial ../summary.hbs \
	--partial ../global-index.hbs \
	> ../js-sdk-api.md

jsdoc2md \
	--configure ../jsdoc-config-cm.json \
	--files "." \
	--no-cache \
	--separators \
	--example-lang js \
	--partial ../scope.hbs \
	--partial ../summary.hbs \
	--partial ../global-index.hbs \
	> ../js-sdk-api_consentManager.md




# local helper, delete before committing
rm ~/code/TD-API-Documentation/docs/js-sdk/api.md
cp ~/code/td-js-sdk/js-sdk-api.md ~/code/TD-API-Documentation/docs/js-sdk/api.md
rm ~/code/TD-API-Documentation/docs/js-sdk/consent_manager.md
cp ~/code/td-js-sdk/js-sdk-api_consentManager.md ~/code/TD-API-Documentation/docs/js-sdk/consent_manager.md
