## @PotOfCoffee2Go/git-server wiki

Install [TiddlyWiki](https://tiddlywiki.com):
```
npm install -g tiddlywiki
```

> May need `sudo` on Linux depends on your permission settings

From git-server project directory:

```
tiddlywiki wiki --listen port=8080
```

Make chabges using the TiddlyWiki web interface [http://localhost:8080](http://localhost:8080)

To deploy updates:

 - Click the `cloud` icon and select 'Save snapshot for offline use'
 - Will download 'tiddlywiki.html' to your default download directory
 - Copy to git-server project 'docs' directory
 - Rename to 'index.html'
 - Commit to GitHub
 - GitHub will deploy changes to git-server [gh-pages](https://potofcoffee2go.github.io/git-server/)

