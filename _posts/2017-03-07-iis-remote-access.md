---
layout: post
title: Access IIS Express from another machine
description: "How to Access IIS Express from another machine"
tags: [post, netcore, network, iisexpress, remote, access]
share: true
image:
  feature: servers.jpg
---

# The Problem

You have a website running in your local machine using IIS Express and you want another computer on your local network to be able to reach said website.

This becomes useful ~~never~~ when said website is some REST API.
The coder next to you needs your local developments to test some of his stuff but what you are doing is so epic, that cannot be committed to source control just yet.

Enter, sharing access.

# The Solution

You should not have the problem above.
You should commit your code.
The developments of each programmer should be contained and not affect other people.

Yeah, after you have listened to your inner scrum master telling you all the above and maybe more, let's get back to business.

There's two ways to go around this:

 1. The easy way: npm install your way out this
 1. The right way: tell IIS to allow external access

# The Easy Way

You can install this little helper [IIS Proxy] with:

```sh
    $ npm install -g iisexpress-proxy
    $ iisexpress-proxy host:localPort to proxyPort
    # now open <your-ip>:<proxyPort> on "any" machine and marvel...
```

Sample output:
```sh
    $ iisexpress-proxy 192.168.1.93:60534 to 5001
    IIS Express Proxy 1.1.8
    Proxying http://192.168.1.93:60534 to network interfaces:
            VPN Connection: 10.50.100.173:5001
            Local Area Connection: 192.168.1.93:5001
            VirtualBox Host-Only Network: 192.168.56.1:5001
    Listening... [press Control-C to exit]
```

# The Right Way

You can tell IIS Express to allow external requests.
By default it blocks them (allows only localhost).

Now the IF.
If you are using Visual Studio 2015 you've go to:

```sh
$ cd <src-root>
$ vim .vs/config/applicationhost.config
```

Find your website entry in there (there may be several) and update the binding:

```xml
<site name="Epic Website" id="1">
    <application path="/">
        <virtualDirectory path="/" physicalPath="%SystemDrive%/road/to/nowhere/app" />
    </application>
    <bindings>
        <!-- Replace your binding with this line -->
        <!-- The last * tells IIS that it should reply to anything -->
        <binding protocol="http" bindingInformation="*:80:*" />
    </bindings>
</site>
```

If you are using and older VS (before 2015) you need to to apply the same configuration update but the file's location will be:

```shell
$ vim %USERPROFILE%\Documents\iisexpress\config\applicationhost.config
```

After updating the configuration, the website must be restarted.
If all goes well, you should be able to access the local website from the local network.

I was able to get this working without any ACL/HTTP.sys magic as mentioned [here][1] but YMMV.

# Sources

 - [http://bendetat.com/access-iis-express-from-another-machine.html][1]
 - [IIS Proxy]
 - [Doc for applicationhost.config bindings](https://www.iis.net/configreference/system.applicationhost/sites/site/bindings/binding)
 
 [IIS Proxy]: https://www.npmjs.com/package/iisexpress-proxy
 [1]: http://bendetat.com/access-iis-express-from-another-machine.html
 
# Glossary

| Term | Description |
| -: |:-| 
| IIS | Internet Information Services -- Microsoft Web Server |
| IIS Express | Lightweight, self-contained version of IIS optimized for development work |
| YMMV | your mileage may vary | 
{:.glossaryTable}
