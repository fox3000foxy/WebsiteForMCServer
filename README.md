# ServerWebsite _by fox3000foxy_
This project is full complete and editable website for server.
I'll present you how to set up the website of your server.

```
main
  |- data
      |- accounts.json (Database of accounts registred on your server)
      |- feedback.json (Database of feedbacks)
      |- market.json (Shop in game: When item clicked, player buy this item)
      |- staff.json (Database of staff persons)
      |- avatarException.json (see !https://github.com/fox3000foxy/DiscordMC_IRC)
  |- disp
      |- about.json (database of "About" tab)
      |- features.html (HTML template of features of your server)
      |- irc.json (give widget link of your discord server)
      |- main.json (set the article titles and trailer URL)
      |- map.json (set the link of your prismarine-viewer bot; if `null`, set the same hostname with 3001 port)
      |- partnerships.json (database of parterships name)
      |- tabs.json (set tabs name)
      |- titles.json (set titles under tabs)
  |- lib (irc library, see !https://github.com/fox3000foxy/DiscordMC_IRC)
  |- public
      |- fonts
          |- Minecraftia.ttf (Minecraft fonts)
      |- images (used images)
          |- icon.png (favicon)
          |- logo.png (logo which redirect index page between tabs)
      |- style
          |- text.css (main css)
          |- w3.css (W3 CSS)
      |- ... (webpages of your website)
  |- template
      |- templateStart.html (header of website, contains tabs and titles)
      |- templateEnd.html (footer of website, contains copyright)
  |- index.js (main script)
  |- package.json (package properties)
  |- package-lock.json (dependencies of dependecies...)
  |- README.md (this file)
  |- serverConfig.json (Mineflayers bot connections depends of that)
```

Bots must have access to /tellraw, /execute, /scoreboard and selectors...<br>
A scoreboard with name "Coins" must be created
