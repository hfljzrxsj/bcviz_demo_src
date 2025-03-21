import { parse, serialize } from 'cookie';
// import { sign, unsign } from "cookie-signature";
import { set, get, remove, getJSON, noConflict, withConverter } from "js-cookie";
import { parseDate, formatDate, canonicalDomain, domainMatch, defaultPath, pathMatch, parse as tough_cookie_parse, fromJSON, getPublicSuffix, cookieCompare, permuteDomain, permutePath } from "tough-cookie";
console.log({ parse, serialize },
  // { sign, unsign },
  { set, get, remove, getJSON, noConflict, withConverter },
  { parseDate, formatDate, canonicalDomain, domainMatch, defaultPath, pathMatch, tough_cookie_parse, fromJSON, getPublicSuffix, cookieCompare, permuteDomain, permutePath },);
(() => {
  // let cookies = parse('foo=bar; equation=E%3Dmc%5E2');
  // console.log(cookies['foo']); // bar
  // console.log(cookies['equation']); // E=mc^2

  // To serialize a cookie into a string:
  let setCookie = serialize('hjx', 'hjxs', { expires: new Date(new Date().getTime() * 1.5) });
  // console.log(setCookie); // foo=bar; HttpOnly
  document.cookie = setCookie;
  document.cookie = serialize('hjxssss', 'hjxs', { expires: new Date(new Date().getTime() * 1.5) });
  console.log(parse(document.cookie));
})();
// (() => {
//   let signedValue = sign('hello', 'secret');
//   console.log(signedValue); // hello.5d41402abc4b2a76b9719d911017c592

//   // To unsign/validate a cookie value:
//   let originalValue = unsign(signedValue, 'secret');
//   console.log(originalValue); // hello
// })();
(() => {
  const k = `${new Date().getTime()}`;
  set(k, 'bar', { expires: new Date(new Date().getTime() * 1.5) });
  // To get a cookie:
  let foo = get(k);
  console.log(foo); // bar
  // To remove a cookie:
  remove(k);
})();
(() => {

  // parseDate
  // let date = parseDate('Wed, 13-Jan-2021 22:23:01 GMT');
  // console.log(new Date(), date); // Outputs the date object

  // // formatDate
  // let dateString = formatDate(new Date());
  // console.log(dateString); // Outputs the date string in HTTP header format

  // // canonicalDomain
  // let canonical = canonicalDomain('www.example.com');
  // console.log(canonical); // Outputs: example.com

  // // domainMatch
  // let match = domainMatch('www.example.com', 'example.com');
  // console.log(match); // Outputs: true

  // // defaultPath
  // let defaultPaths = defaultPath('/some/path');
  // console.log(defaultPaths); // Outputs: /some

  // // pathMatch
  // let pathMatchs = pathMatch('/some/path', '/some');
  // console.log(pathMatchs); // Outputs: true

  // parse (as tough_cookie_parse)
  let cookie = tough_cookie_parse(document.cookie);
  console.log(cookie);

  // fromJSON
  let cookieFromJson = fromJSON(JSON.stringify(cookie));
  console.log(cookieFromJson);

  // getPublicSuffix
  let suffix = getPublicSuffix('www.example.com');
  console.log(suffix); // Outputs: example.com

  // cookieCompare
  // let c1 = parse('a=0; Domain=example.com');
  // let c2 = parse('b=1; Domain=www.example.com');
  // // let compare = cookieCompare(c1, c2);
  // console.log(c1, c2); // Outputs: -1, 0, or 1

  // permuteDomain
  let permuteDomains = permuteDomain('www.example.com');
  console.log(permuteDomains); // Outputs: [ 'www.example.com', 'example.com', 'com' ]

  // permutePath
  let permutePaths = permutePath('/path/to/something');
  console.log(permutePaths); // Outputs: [ '/path/to/something', '/path/to', '/path', '/' ]

})();