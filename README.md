### @PotOfCoffee2Go/git-server

Git server for local network use.

See @potofcoffee2go/git-server [github-page](https://potofcoffee2go.github.io/git-server/) for more details. 

Install
```
git clone https://github.com/PotOfCoffee2Go/git-server.git
cd git-server
npm install
npm start
```
**Meanwhile... in a separate terminal window**

Create a local project directory and add a package.json:
```
mkdir my-project
cd my-project
npm init -y
```
Then do git things:
```
git init
git branch -M main
git remote add git-server http://42:42@localhost:8090/my-project.git
git add .
git commit -am "Initial commit"
git push -u git-server main
git remote show git-server
```
the 'my-project.git' repo will be automatically created containing the package.json

From then on can commit changes:
```
git add .
git commit -am "<message>"
git push
```
Clone as usual:
```
git clone http://42:42@localhost:8090/my-project.git
```

- the 42:42@ is user password
- see `./index.js` for setting up user passwords and 'https'
