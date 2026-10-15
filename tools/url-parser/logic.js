var DEFAULT_PORTS = { 'http:': '80', 'https:': '443', 'ftp:': '21', 'ws:': '80', 'wss:': '443' };

function safeDecode(s) {
    try {
        return decodeURIComponent(s);
    } catch (err) {
        return s;
    }
}

function decodeQueryPart(s) {
    return safeDecode(s.replace(/\+/g, ' '));
}

function parseParams(raw) {
    var groups = [];
    var byName = {};
    if (!raw) return groups;

    raw.split('&').forEach(function (pair) {
        if (!pair) return;
        var eq = pair.indexOf('=');
        var name = decodeQueryPart(eq < 0 ? pair : pair.slice(0, eq));
        var value = eq < 0 ? '' : decodeQueryPart(pair.slice(eq + 1));

        if (!Object.prototype.hasOwnProperty.call(byName, name)) {
            byName[name] = { name: name, values: [] };
            groups.push(byName[name]);
        }
        byName[name].values.push(value);
    });
    return groups;
}

function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function infoTip(content) {
    var wrap = el('span', 'info-wrap');
    var btn = el('button', 'info', 'i');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'More info');
    btn.setAttribute('aria-expanded', 'false');
    var tip = el('span', 'tip');
    [].concat(content).forEach(function (part) {
        if (typeof part === 'string') {
            tip.appendChild(document.createTextNode(part));
            return;
        }
        var a = el('a', null, part.text);
        a.href = part.href;
        a.target = '_blank';
        a.rel = 'noopener';
        tip.appendChild(a);
    });
    tip.hidden = true;
    tip.setAttribute('role', 'tooltip');

    function setOpen(open) {
        tip.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(tip.hidden);
    });
    document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });

    wrap.appendChild(btn);
    wrap.appendChild(tip);
    return wrap;
}

function addRow(card, key, value, opts) {
    opts = opts || {};
    var row = el('div', 'row');
    var k = el('div', 'k', key);
    if (opts.note) k.appendChild(infoTip(opts.note));
    row.appendChild(k);

    var v = el('div', 'v');
    if (value === '' || value === null || value === undefined) {
        v.classList.add('empty');
        v.textContent = opts.emptyText || 'none';
    } else {
        v.textContent = value;
    }
    if (opts.tag) v.appendChild(el('span', 'tag', opts.tag));
    if (opts.parseable) {
        var link = el('a', 'mini', 'parse url \u2197');
        link.href = location.pathname + '#url=' + encodeURIComponent(value);
        link.target = '_blank';
        link.rel = 'noopener';
        link.title = 'Parse this URL in a new tab';
        link.setAttribute('aria-label', 'Parse this URL in a new tab');
        v.appendChild(link);
    }
    row.appendChild(v);
    card.appendChild(row);
}

function addCard(report, title, count) {
    var card = el('section', 'card');
    var h = el('h2', null, title);
    if (count !== undefined) h.appendChild(el('span', 'count', String(count)));
    card.appendChild(h);
    report.appendChild(card);
    return card;
}

function looksLikeUrl(s) {
    return /^[a-z][a-z0-9+.-]*:\/\/\S+$/i.test(s);
}

function addParams(card, groups) {
    groups.forEach(function (g) {
        var multi = g.values.length > 1;
        var shown = multi ? JSON.stringify(g.values) : g.values[0];
        addRow(card, g.name, shown, {
            tag: multi ? g.values.length + ' values' : null,
            emptyText: 'empty',
            parseable: !multi && looksLikeUrl(g.values[0])
        });
    });
}

function render(report, input) {
    var url = new URL(input);
    var hasAuthority = url.host !== '' || /^[a-z][a-z0-9+.-]*:\/\//i.test(input);

    report.textContent = '';

    var overview = addCard(report, 'Overview');
    addRow(overview, 'Scheme', url.protocol.replace(/:$/, ''));
    if (hasAuthority) {
        addRow(overview, 'Origin', url.origin === 'null' ? '' : url.origin, { emptyText: 'opaque' });
    }
    addRow(overview, 'Path', safeDecode(url.pathname));

    if (hasAuthority) {
        var userinfo = '';
        if (url.username || url.password) {
            userinfo = safeDecode(url.username) + (url.password ? ':' + safeDecode(url.password) : '') + '@';
        }
        addRow(overview, 'Authority', userinfo + url.host, {
            note: 'The RFC 3986 name for the part of a URL between // and the first /, ? or #.'
        });
        if (url.username) addRow(overview, 'Username', safeDecode(url.username));
        if (url.password) addRow(overview, 'Password', safeDecode(url.password));
        addRow(overview, 'Hostname', url.hostname);
        var labels = url.hostname.split('.');
        var isIp = /^[\d.]+$/.test(url.hostname) || url.hostname.charAt(0) === '[';
        if (!isIp && labels.length > 2) {
            addRow(overview, 'Subdomain', labels.slice(0, -2).join('.'));
        }
        if (!isIp && labels.length > 1) {
            addRow(overview, 'Domain', labels.slice(-2).join('.'), {
                note: [
                    'Naive: this takes the last two labels of the hostname and does not use the public suffix list (',
                    { text: 'publicsuffix.org', href: 'https://publicsuffix.org/' },
                    '), the maintained list of domain endings such as .co.uk, .com.au or .github.io. ' +
                    'For www.bbc.co.uk it shows co.uk instead of bbc.co.uk. It is correct for most .com, .nl and .app hostnames.'
                ]
            });
        }
        var port = url.port || DEFAULT_PORTS[url.protocol] || '';
        addRow(overview, 'Port', port, { tag: url.port ? 'explicit' : 'default', emptyText: 'none' });
    }

    var queryGroups = parseParams(url.search.slice(1));
    var qCard = addCard(report, 'Query string', queryGroups.length ? queryGroups.length + ' params' : undefined);
    if (queryGroups.length) {
        addParams(qCard, queryGroups);
    } else {
        addRow(qCard, '', '', { emptyText: 'no query string' });
    }

    var other = addCard(report, 'Other');
    var fragment = url.hash.slice(1);
    addRow(other, 'Fragment', safeDecode(fragment), { emptyText: 'none' });
    if (/^[^=&]*=/.test(fragment) && fragment.indexOf('/') < 0) {
        addParams(other, parseParams(fragment));
    }
    addRow(other, 'Normalized', url.href, {
        note: "The Normalized row shows url.href, which is the URL after the browser's own parser has cleaned it up. " +
            'The WHATWG URL standard defines that cleanup, and it\'s what new URL() produces.'
    });
}

window.onload = function () {
    var input = document.getElementById('url-text');
    var clear = document.getElementById('url-clear');
    var message = document.getElementById('url-message');
    var report = document.getElementById('url-report');

    function saveToHash(text) {
        location.replace('#' + (text ? 'url=' + encodeURIComponent(text) : ''));
    }

    function update() {
        var text = input.value.trim();
        saveToHash(text);
        clear.hidden = !input.value;
        message.textContent = '';
        report.hidden = true;
        if (!text) return;

        try {
            render(report, text);
            report.hidden = false;
        } catch (err) {
            message.textContent = 'Not a valid absolute URL (include the scheme, e.g. https://).';
        }
    }

    input.addEventListener('input', update);

    var initial = new URLSearchParams(location.hash.slice(1)).get('url');
    if (initial) {
        input.value = initial;
        update();
    }

    clear.addEventListener('click', function () {
        input.value = '';
        update();
        input.focus();
    });
};
