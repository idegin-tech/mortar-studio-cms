# Dos and Don'ts
Make sure to follow the coding style and file naming convention of the project.
Make sure the files you update don't have error or syntax errors.
Make sure to check other files to see how it was implemented other places.
Make sure to follow express and nodejs Best practices.
Make sure to follow the project's file naming convention <name>.<purpose>.<extension> Ex. random.utils.ts or user.Make sure your implementation is production ready.
Make sure to use packages instead of custom implementations.
Feel free to install any needed packages.
MS means Mortar Studio.
Don't add code comments.
Don't add code comments.
Don't add code comments.



# About The Mortar Studio Package
It's an express app middleware that serves the CMS (/app/dashboard) .next build in the /ms-admin/* and other mortar studio package API routes routes in /ms-admin/api. It uses SQL based on the host project's mortar-studio.config.json file.
The mortar-studio.config.json holds the metadata and configuration for the middleware. when the mortar studio package is built we move the dashboard build to the mortar studio package dir so they can both be packages for the npm registry. The mortar studio package will be linked to the test project for testing and development.

# The Test Project
The test project is where we will be testing the mortar studio middleware (test-project-express & test-project-next) on both an express app, as well as a next js app.
