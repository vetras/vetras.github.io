---
layout: post
title: HTTPS All The Things
description: security matters
tags: [security, post]
image:
  background: ps_neutral.png
  feature: lock.jpeg
  credit: pexels
  creditlink: https://www.pexels.com/photo/selective-photography-of-skeleton-key-hanging-217316/
---

One does not simply use HTTPS.
At least not yet.

Github Pages is great.
That is why I use it.

One of the features it lacks though, is the ability to use HTTPS with a custom domain. You may read that again.
It will allow it [eventually](https://github.com/isaacs/github/issues/156), but not today.

However, fear not!
This is 2017 and we use computers, therfore we can do whatever we want. It's just a matter of how much effort are you willing to put in.

Some clever folks come up with some workarounds like [this](https://blog.keanulee.com/2014/10/11/setting-up-ssl-on-github-pages.html) and [this](https://sheharyar.me/blog/free-ssl-for-github-pages-with-custom-domains/).

The trick is to use Cloudflare's free service that provides a SSL certificate to have HTTPS going from the user to the cloudflare servers.
Then they redirect the traffic to github pages on HTTP.
As I said, a workaround.

Although not perfect, this solves most of the issues (e.g. the hacker is on the same unsecured Wi-Fi network) and it allows your site to behave as if it has SSL (e.g. for web crawlers, APIs). Besides, all this is free.

If you know better, please do let me know on the comments below!

# This post is too short, I want to read more:

 - [GitHub Pages Now (Sorta) Supports HTTPS](https://konklone.com/post/github-pages-now-sorta-supports-https-so-use-it)
 - [Cloudflare's Universal SLL](https://blog.cloudflare.com/introducing-universal-ssl/)

