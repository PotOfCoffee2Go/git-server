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

```
tiddlywiki wiki/docs --output docs --build index
```
