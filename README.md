# quick_links_chrome

*Get to the information you need faster!*

The **Quick Links** browser extension allows you to rapidly access
previously visited webpages without needing to dig through your
browser history or bookmarks bar. All you have to do is
come up with a memorable name for a webpage you want to visit again,
then later, you only need to type that name into your URL bar,
and you are there!

### For example

If you wanted to bookmark `https://github.com/aaronstanek/quick_links_chrome`
you could just give it the name `quicklinks`.
Then when you needed to go back to that page, you could just type `go quicklinks`
into your URL bar, and you'll be taken directly there.

This works everything, be it a public webpage, private Google Doc, a social media profile, 
a browser extension settings page, or even a local file. It's fast. It's easy.

### Dynamic links

You can also use this extension to cut out the middle-man.
Say you wanted to search Google Maps. Ordinarily, you would
have to navigate to the page, and then enter your search.

With **Quick Links**, you can search almost any website
with a search function directly from your URL bar.
For example typing `go maps/restaurants near me` into the URL bar could take you
directly to the Google Maps search results for `"restaurants near me"`.

### How to use it

After loading the extension, type `go links` into your URL
bar, then press enter. You will be directed to the link manager page.
Here you can create, delete, and view your links.

To use a quick link, enter `go *YOUR_QUICK_LINK*` into the URL bar.

To do simple replacement of link text, use `%x#` where `#` is a digit `[0-9]`.
In the Quick Link, each `%x` variable may only be preceded by a `/` character,
and may only be followed by a `/` or the end of the link.
In the URL, the text will be placed at the location of the corresponding `%x` variable.
The variables in the URL may be placed anywhere.
For example:

| Quick Link  | URL |
| ----------- | ----------- |
| wiki/<span style="color:red">%X1</span> | htt<span>ps://</span>en.wikipedia.org/wiki/<span style="color:red">%X1</span> |
| github/commits/<span style="color:red">%X7</span>/<span style="color:red">%X0</span> | htt<span>ps://</span>github.com/aaronstanek/<span style="color:red">%X7</span>/commits/<span style="color:red">%X0</span> |
| reddit/<span style="color:red">%x5</span> | htt<span>ps://</span><span style="color:red">%x5</span>.reddit.com |

With this you could type `go wiki/potato` to go to the page `https://en.wikipedia.org/wiki/potato`.

### Built-in links

Some links are built-in and cannot be deleted or changed.

- `help`
- `links`
- `links/help`
- `links/new`
- `links/new/*`
- `links/export`
- `links/import`

The export and import pages may be used to copy your data from one computer to another.

## Public domain images

- Trash Can Icon: https://publicdomainvectors.org/en/free-clipart/Trash-can-icon/72340.html
- Pencil Icon: https://publicdomainvectors.org/en/free-clipart/Pencil-icon/44337.html
- Checkmark Icon: https://publicdomainvectors.org/en/free-clipart/Button-ok/87848.html
- Cancel Icon: https://publicdomainvectors.org/en/free-clipart/Cancel-button-icon/87847.html
