# IODynamic_Web
The following project is a state-of-the-art framework used to create final version of IODynamic website coded by Typescript/Scss without any external dependency or framework.

------------------------------
**Run**:
Create a .bat file and include following code:

cd [C://Path/To/The/Source/Code]

npm run development

pause

------------------------------
**Install**:

npm install --global typescript

or

npm install --save-dev typescript

If you use the --global option, then the TypeScript compiler tsc will be available in all projects on the same machine. It will also be available as a terminal command, but it will not be added to your package.json file. Therefore, if you share your code with others, TypeScript will not be installed when another person gets your code and runs npm install.

If you use --save-dev, TypeScript will be added to package.json and installed in your project’s node_modules folder (current size: 34.2 MB), but it will not be available directly as a terminal command.

You can still run it from the terminal as ./node_modules/.bin/tsc, and you can still use tsc inside the npm "scripts" section of package.json.


//To create ts.config
tsc --init
